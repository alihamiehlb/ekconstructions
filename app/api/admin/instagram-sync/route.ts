import { verifyAdminSession } from "@/lib/auth";
import { syncInstagramFromUrls } from "@/lib/instagram/sync";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation } from "@/lib/security/api-guard";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  urls: z
    .array(
      z
        .string()
        .min(10)
        .max(500)
        .refine((u) => /instagram\.com\/(p|reel|tv)\//i.test(u), "Must be an Instagram post URL"),
    )
    .min(1)
    .max(50),
});

export async function POST(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "instagram-sync", max: 3, windowMs: 60 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide 1–40 Instagram post URLs (one per line in the form)." },
      { status: 400 },
    );
  }

  const result = await syncInstagramFromUrls(parsed.data.urls);
  // Persist to Supabase + content/instagram-feed.json

  await logSecurityEvent({
    type: "instagram_sync",
    detail: `synced=${result.synced} failed=${result.failed.length}`,
  });

  return NextResponse.json({
    ok: result.ok,
    synced: result.synced,
    failed: result.failed,
    syncedAt: result.feed.syncedAt,
    posts: result.feed.posts.map((p) => ({
      shortcode: p.shortcode,
      permalink: p.permalink,
      imageCount: p.images.length,
      isCarousel: p.isCarousel,
      thumbnail: p.thumbnail,
    })),
  });
}
