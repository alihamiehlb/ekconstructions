import { discoverProfilePostUrls } from "@/lib/instagram/discover-profile";
import { fetchInstagramPostDetailed } from "@/lib/instagram/fetch-post";
import { normalizeInstagramUrl } from "@/lib/instagram/parse-url";
import { titleFromCaption } from "@/lib/instagram/caption-utils";
import {
  readInstagramFeed,
  readInstagramPostUrls,
  writeInstagramFeed,
} from "@/lib/instagram/feed";
import type { InstagramFeed, InstagramPost } from "@/lib/instagram/types";
import { logAppEvent } from "@/lib/logging/app-logger";

export type SyncFailure = { url: string; reason: string };

export type SyncInstagramResult = {
  ok: boolean;
  synced: number;
  failed: string[];
  failedDetails: SyncFailure[];
  feed: InstagramFeed;
  discovered?: number;
};

const MAX_POSTS_PER_SYNC = 25;

function mergePosts(existing: InstagramPost[], incoming: InstagramPost[]): InstagramPost[] {
  const map = new Map(existing.map((p) => [p.shortcode, p]));
  for (const post of incoming) map.set(post.shortcode, post);
  return [...map.values()];
}

function mergeUrls(existing: string[] | undefined, incoming: string[]): string[] {
  const normalized = incoming.map(normalizeInstagramUrl).filter(Boolean);
  return [...new Set([...(existing ?? []), ...normalized])];
}

export async function syncInstagramFromUrls(
  urls: string[],
  options?: { username?: string; profileUrl?: string },
): Promise<SyncInstagramResult> {
  const existing = await readInstagramFeed();
  const incoming: InstagramPost[] = [];
  const failed: string[] = [];
  const failedDetails: SyncFailure[] = [];

  const uniqueUrls = [...new Set(urls.map((u) => normalizeInstagramUrl(u)).filter(Boolean))].slice(
    0,
    MAX_POSTS_PER_SYNC,
  );

  if (uniqueUrls.length === 0) {
    return {
      ok: false,
      synced: 0,
      failed: [],
      failedDetails: [],
      feed: existing,
    };
  }

  await logAppEvent({
    level: "info",
    source: "instagram.sync",
    message: "Instagram sync started",
    context: { urlCount: uniqueUrls.length },
  });

  for (const url of uniqueUrls) {
    try {
      const { post, error } = await fetchInstagramPostDetailed(url);
      if (post) {
        incoming.push(post);
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
        const reason = error ?? "No images returned";
        failedDetails.push({ url, reason });
        await logAppEvent({
          level: "error",
          source: "instagram.sync",
          message: "Post fetch failed",
          context: { url, reason },
        });
      }
    } catch (error) {
      failed.push(url);
      const reason = error instanceof Error ? error.message : "Unexpected error";
      failedDetails.push({ url, reason });
      await logAppEvent({
        level: "error",
        source: "instagram.sync",
        message: "Post sync threw an error",
        context: { url, error: reason },
      });
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const posts = mergePosts(existing.posts, incoming);

  const feed: InstagramFeed = {
    username: options?.username ?? existing.username,
    profileUrl: options?.profileUrl ?? existing.profileUrl,
    syncedAt: new Date().toISOString(),
    posts,
    savedUrls: mergeUrls(existing.savedUrls, uniqueUrls),
  };

  await writeInstagramFeed(feed);

  await logAppEvent({
    level: failed.length ? "warn" : "info",
    source: "instagram.sync",
    message: "Instagram sync finished",
    context: { synced: incoming.length, failed: failed.length, totalPosts: posts.length },
  });

  return {
    ok: incoming.length > 0,
    synced: incoming.length,
    failed,
    failedDetails,
    feed,
  };
}

export async function removeInstagramPost(shortcode: string): Promise<InstagramFeed> {
  const existing = await readInstagramFeed();
  const posts = existing.posts.filter((p) => p.shortcode !== shortcode);
  const savedUrls = (existing.savedUrls ?? []).filter(
    (u) => !u.includes(`/${shortcode}`) && !u.endsWith(`/${shortcode}/`),
  );

  const feed: InstagramFeed = {
    ...existing,
    posts,
    savedUrls,
    syncedAt: new Date().toISOString(),
  };

  await writeInstagramFeed(feed);

  await logAppEvent({
    level: "info",
    source: "instagram.delete",
    message: "Instagram post removed from gallery",
    context: { shortcode, remaining: posts.length },
  });

  return feed;
}

export async function discoverAndSyncInstagram(username = "ekconstructions"): Promise<
  SyncInstagramResult & { discoverError?: string; method?: string }
> {
  const discovery = await discoverProfilePostUrls(username);
  const manual = await readInstagramPostUrls();
  const merged = [...new Set([...discovery.urls.map(normalizeInstagramUrl), ...manual])];

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
      failedDetails: [],
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
