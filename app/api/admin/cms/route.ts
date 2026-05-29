import { verifyAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import { cmsSchema } from "@/lib/cms/schema";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizeCmsPayload } from "@/lib/security/sanitize-cms";
import { NextResponse } from "next/server";

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cms = await readCms();
  return NextResponse.json(cms, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-cms", max: 30, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = cmsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid CMS data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const sanitized = sanitizeCmsPayload(parsed.data);
  await writeCms({ ...sanitized, updatedAt: new Date().toISOString() });

  await logSecurityEvent({
    type: "cms_update",
    ip: getClientIp(request),
    detail: "CMS content updated",
  });

  return NextResponse.json({ ok: true });
}
