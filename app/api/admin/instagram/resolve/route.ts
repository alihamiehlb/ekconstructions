import { assertAdminRole } from "@/lib/auth";
import { isInstagramPostUrl } from "@/lib/instagram/resolve-image";
import { resolveGalleryImageSource } from "@/lib/instagram/resolve-image";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { logSecurityEvent } from "@/lib/security/audit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await assertAdminRole(["admin", "editor"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-instagram-resolve", max: 40, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  if (!isInstagramPostUrl(url)) {
    return NextResponse.json(
      { error: "Paste a public Instagram post or reel link (instagram.com/p/…)." },
      { status: 400 },
    );
  }

  try {
    const imageUrl = await resolveGalleryImageSource(url);
    await logSecurityEvent({
      type: "instagram_discover",
      ip: getClientIp(request),
      detail: "Resolved Instagram post preview",
    });
    return NextResponse.json({ ok: true, imageUrl, sourceUrl: url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not resolve Instagram image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
