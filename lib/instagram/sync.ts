import { discoverProfilePostUrls } from "@/lib/instagram/discover-profile";
import { fetchInstagramPost } from "@/lib/instagram/fetch-post";
import { titleFromCaption } from "@/lib/instagram/caption-utils";
import {
  readInstagramFeed,
  readInstagramPostUrls,
  writeInstagramFeed,
} from "@/lib/instagram/feed";
import type { InstagramFeed, InstagramPost } from "@/lib/instagram/types";
import { logAppEvent } from "@/lib/logging/app-logger";

export type SyncInstagramResult = {
  ok: boolean;
  synced: number;
  failed: string[];
  feed: InstagramFeed;
  discovered?: number;
};

const MAX_POSTS_PER_SYNC = 20;

export async function syncInstagramFromUrls(
  urls: string[],
  options?: { username?: string; profileUrl?: string },
): Promise<SyncInstagramResult> {
  const existing = await readInstagramFeed();
  const posts: InstagramPost[] = [];
  const failed: string[] = [];

  const uniqueUrls = [...new Set(urls.map((u) => u.trim()).filter(Boolean))].slice(
    0,
    MAX_POSTS_PER_SYNC,
  );

  if (uniqueUrls.length === 0) {
    return { ok: false, synced: 0, failed: [], feed: existing };
  }

  await logAppEvent({
    level: "info",
    source: "instagram.sync",
    message: "Instagram sync started",
    context: { urlCount: uniqueUrls.length },
  });

  for (const url of uniqueUrls) {
    try {
      const post = await fetchInstagramPost(url);
      if (post) {
        posts.push(post);
        await logAppEvent({
          level: post.caption ? "info" : "warn",
          source: "instagram.sync",
          message: post.caption ? "Post synced with caption" : "Post synced without caption",
          context: {
            shortcode: post.shortcode,
            title: post.title ?? titleFromCaption(post.caption),
            captionLength: post.caption.length,
            imageCount: post.images.length,
            isCarousel: post.isCarousel,
          },
        });
      } else {
        failed.push(url);
        await logAppEvent({
          level: "error",
          source: "instagram.sync",
          message: "Post fetch returned no images",
          context: { url },
        });
      }
    } catch (error) {
      failed.push(url);
      await logAppEvent({
        level: "error",
        source: "instagram.sync",
        message: "Post sync threw an error",
        context: { url, error: error instanceof Error ? error.message : String(error) },
      });
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const feed: InstagramFeed = {
    username: options?.username ?? existing.username,
    profileUrl: options?.profileUrl ?? existing.profileUrl,
    syncedAt: new Date().toISOString(),
    posts,
    savedUrls: uniqueUrls,
  };

  await writeInstagramFeed(feed);

  await logAppEvent({
    level: failed.length ? "warn" : "info",
    source: "instagram.sync",
    message: "Instagram sync finished",
    context: { synced: posts.length, failed: failed.length },
  });

  return { ok: failed.length === 0 && posts.length > 0, synced: posts.length, failed, feed };
}

export async function discoverAndSyncInstagram(username = "ekconstructions"): Promise<
  SyncInstagramResult & { discoverError?: string; method?: string }
> {
  const discovery = await discoverProfilePostUrls(username);
  const manual = await readInstagramPostUrls();
  const merged = [...new Set([...discovery.urls, ...manual])];

  await logAppEvent({
    level: "info",
    source: "instagram.discover",
    message: "Profile discover finished",
    context: {
      username,
      discovered: discovery.urls.length,
      manual: manual.length,
      merged: merged.length,
      method: discovery.method ?? "unknown",
      error: discovery.error ?? null,
    },
  });

  if (merged.length === 0) {
    const existing = await readInstagramFeed();
    return {
      ok: false,
      synced: 0,
      failed: [],
      feed: existing,
      discovered: 0,
      discoverError:
        discovery.error ??
        "No post URLs found. Paste Instagram links manually or set INSTAGRAM_SESSION_ID in Vercel.",
      method: discovery.method,
    };
  }

  const result = await syncInstagramFromUrls(merged, {
    username,
    profileUrl: `https://www.instagram.com/${username}/`,
  });

  return {
    ...result,
    discovered: discovery.urls.length,
    discoverError: discovery.error,
    method: discovery.method,
  };
}

export async function syncInstagramFromConfig(): Promise<SyncInstagramResult> {
  return syncInstagramFromUrls(await readInstagramPostUrls());
}
