import { verifyAdminSession } from "@/lib/auth";
import { removeInstagramPost } from "@/lib/instagram/sync";
import { logAppEvent } from "@/lib/logging/app-logger";
import { guardMutation } from "@/lib/security/api-guard";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  shortcode: z.string().min(8).max(20).regex(/^[A-Za-z0-9_-]+$/),
});

export async function POST(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "instagram-delete", max: 30, windowMs: 60 * 60 * 1000 },
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
    return NextResponse.json({ error: "Invalid shortcode." }, { status: 400 });
  }

  try {
    const feed = await removeInstagramPost(parsed.data.shortcode);
    return NextResponse.json({
      ok: true,
      shortcode: parsed.data.shortcode,
      remaining: feed.posts.length,
      posts: feed.posts.map((p) => ({
        shortcode: p.shortcode,
        permalink: p.permalink,
        caption: p.caption,
        title: p.title,
        thumbnail: p.thumbnail,
        isCarousel: p.isCarousel,
        imageCount: p.images.length,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed.";
    await logAppEvent({
      level: "error",
      source: "instagram.delete.api",
      message: "Delete post failed",
      context: { shortcode: parsed.data.shortcode, error: message },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
