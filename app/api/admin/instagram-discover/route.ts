import { verifyAdminSession } from "@/lib/auth";
import { discoverAndSyncInstagram } from "@/lib/instagram/sync";
import { titleFromCaption } from "@/lib/instagram/caption-utils";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation } from "@/lib/security/api-guard";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "instagram-discover", max: 2, windowMs: 60 * 60 * 1000 },
  });
  if (blocked) return blocked;

  const result = await discoverAndSyncInstagram("ekconstructions");

  await logSecurityEvent({
    type: "instagram_discover",
    detail: `synced=${result.synced} discovered=${result.discovered ?? 0} method=${result.method ?? "none"}`,
  });

  return NextResponse.json({
    ok: result.ok,
    synced: result.synced,
    discovered: result.discovered ?? 0,
    failed: result.failed,
    method: result.method,
    discoverError: result.discoverError,
    syncedAt: result.feed.syncedAt,
    posts: result.feed.posts.map((p) => ({
      shortcode: p.shortcode,
      permalink: p.permalink,
      caption: p.caption,
      title: p.title ?? titleFromCaption(p.caption),
      imageCount: p.images.length,
      isCarousel: p.isCarousel,
      thumbnail: p.thumbnail,
    })),
  });
}
