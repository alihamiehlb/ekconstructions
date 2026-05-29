import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { hashForAudit } from "@/lib/security/csrf";
import { sanitizeEmail, sanitizeText } from "@/lib/security/sanitize";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_SECRET in environment variables." },
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
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const password = sanitizeText(parsed.data.password, 256);
  const email = parsed.data.email ? sanitizeEmail(parsed.data.email) : undefined;

  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    await logSecurityEvent({
      type: "login_failed",
      ip,
      detail: email ? hashForAudit(email) : hashForAudit(password),
    });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  try {
    await createAdminSession(user);
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

  await logSecurityEvent({
    type: "login_success",
    ip,
    detail: user.email ?? "legacy",
  });

  return NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role } });
}
