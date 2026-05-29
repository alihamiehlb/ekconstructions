import { readInstagramFeedFromSupabase } from "@/lib/instagram/supabase-feed";
import { fetchInstagramPostDetailed } from "@/lib/instagram/fetch-post";
import {
  isPersistedMediaUrl,
  persistInstagramPost,
} from "@/lib/instagram/persist-images";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Public image fallback — redirects to persisted Supabase URL or fresh oEmbed thumbnail. */
export async function GET(request: Request) {
  const shortcode = new URL(request.url).searchParams.get("shortcode")?.trim();
  if (!shortcode || !/^[A-Za-z0-9_-]+$/.test(shortcode)) {
    return NextResponse.json({ error: "Invalid shortcode" }, { status: 400 });
  }

  const feed = await readInstagramFeedFromSupabase();
  const post = feed?.posts.find((p) => p.shortcode === shortcode);

  if (post?.thumbnail && isPersistedMediaUrl(post.thumbnail)) {
    return NextResponse.redirect(post.thumbnail, 302);
  }

  const { post: fresh } = await fetchInstagramPostDetailed(
    `https://www.instagram.com/p/${shortcode}/`,
  );

  if (fresh) {
    const stored = await persistInstagramPost(fresh);
    if (stored.thumbnail) return NextResponse.redirect(stored.thumbnail, 302);
    if (fresh.thumbnail) return NextResponse.redirect(fresh.thumbnail, 302);
  }

  return NextResponse.json({ error: "Image unavailable" }, { status: 404 });
}
