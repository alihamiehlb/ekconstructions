import { discoverProfilePostUrls } from "@/lib/instagram/discover-profile";
import { fetchInstagramPost } from "@/lib/instagram/fetch-post";
import { titleFromCaption } from "@/lib/instagram/caption-utils";
import {
  readInstagramFeed,
  readInstagramPostUrls,
  writeInstagramFeed,
  writeInstagramPostUrls,
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

export async function syncInstagramFromUrls(
  urls: string[],
  options?: { username?: string; profileUrl?: string },
): Promise<SyncInstagramResult> {
  const existing = await readInstagramFeed();
  const posts: InstagramPost[] = [];
  const failed: string[] = [];

  const uniqueUrls = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];

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
    await new Promise((r) => setTimeout(r, 350));
  }

  const feed: InstagramFeed = {
    username: options?.username ?? existing.username,
    profileUrl: options?.profileUrl ?? existing.profileUrl,
    syncedAt: new Date().toISOString(),
    posts,
  };

  await writeInstagramFeed(feed);
  writeInstagramPostUrls(uniqueUrls);

  await logAppEvent({
    level: failed.length ? "warn" : "info",
    source: "instagram.sync",
    message: "Instagram sync finished",
    context: { synced: posts.length, failed: failed.length },
  });

  return { ok: failed.length === 0, synced: posts.length, failed, feed };
}

export async function discoverAndSyncInstagram(username = "ekconstructions"): Promise<
  SyncInstagramResult & { discoverError?: string; method?: string }
> {
  const discovery = await discoverProfilePostUrls(username);
  const manual = readInstagramPostUrls();
  const merged = [...new Set([...discovery.urls, ...manual])];

  await logAppEvent({
    level: "info",
    source: "instagram.discover",
    message: "Profile discover started",
    context: {
      username,
      discovered: discovery.urls.length,
      manual: manual.length,
      method: discovery.method ?? "unknown",
    },
  });

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
  return syncInstagramFromUrls(readInstagramPostUrls());
}
