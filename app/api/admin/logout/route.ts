import { clearAdminSession, verifyAdminSession } from "@/lib/auth";
import { guardMutation } from "@/lib/security/api-guard";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, { csrf: true, origin: true, requireJson: false });
  if (blocked) return blocked;

  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
