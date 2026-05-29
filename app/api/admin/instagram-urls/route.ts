import { verifyAdminSession } from "@/lib/auth";
import { readInstagramPostUrls } from "@/lib/instagram/feed";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ urls: readInstagramPostUrls() });
}
