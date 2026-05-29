import { verifyAdminSession } from "@/lib/auth";
import { readSecurityAudit } from "@/lib/security/audit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(200, Math.max(10, Number(searchParams.get("limit") ?? 80)));

  const events = await readSecurityAudit(limit);

  return NextResponse.json({
    events,
    vercelHint:
      "Structured JSON logs also appear in Vercel → Project → Logs (Runtime). Filter by level or source.",
  });
}
