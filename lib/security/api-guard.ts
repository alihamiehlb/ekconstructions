import { logSecurityEvent } from "@/lib/security/audit";
import { verifyCsrfToken } from "@/lib/security/csrf";
import { isAllowedOrigin } from "@/lib/security/origin";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { NextResponse } from "next/server";

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

type GuardOptions = {
  csrf?: boolean;
  origin?: boolean;
  rateLimit?: { key: string; max: number; windowMs: number };
  requireJson?: boolean;
};

export async function guardMutation(
  request: Request,
  options: GuardOptions = {},
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const { csrf = true, origin = true, requireJson = true } = options;

  if (requireJson) {
    const ct = request.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
    }
  }

  if (origin && !isAllowedOrigin(request)) {
    await logSecurityEvent({ type: "origin_blocked", ip, detail: request.url });
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }

  if (options.rateLimit) {
    const rl = checkRateLimit(
      `${options.rateLimit.key}:${ip}`,
      options.rateLimit.max,
      options.rateLimit.windowMs,
    );
    if (!rl.allowed) {
      const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
      return NextResponse.json(rateLimitResponse(retryAfter), {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }
  }

  if (csrf && !(await verifyCsrfToken(request))) {
    await logSecurityEvent({ type: "csrf_failed", ip, detail: new URL(request.url).pathname });
    return NextResponse.json({ error: "Invalid or missing CSRF token." }, { status: 403 });
  }

  return null;
}
