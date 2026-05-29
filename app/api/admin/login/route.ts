import { createAdminSession, verifyAdminPassword } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { hashForAudit } from "@/lib/security/csrf";
import { sanitizeText } from "@/lib/security/sanitize";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SECRET in .env.local" },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-login", max: 8, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) {
    await logSecurityEvent({ type: "login_rate_limited", ip });
    return blocked;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const password = sanitizeText(parsed.data.password, 256);

  if (!verifyAdminPassword(password)) {
    await logSecurityEvent({
      type: "login_failed",
      ip,
      detail: hashForAudit(password),
    });
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  try {
    await createAdminSession();
  } catch (e) {
    console.error("createAdminSession:", e);
    return NextResponse.json(
      {
        error:
          "Server misconfigured: ADMIN_SECRET must be at least 32 characters on Vercel.",
      },
      { status: 503 },
    );
  }
  await logSecurityEvent({ type: "login_success", ip });

  return NextResponse.json({ ok: true });
}
