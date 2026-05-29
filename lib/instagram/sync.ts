import { discoverProfilePostUrls } from "@/lib/instagram/discover-profile";
import { fetchInstagramPost } from "@/lib/instagram/fetch-post";
import {
  readInstagramFeed,
  readInstagramPostUrls,
  writeInstagramFeed,
  writeInstagramPostUrls,
} from "@/lib/instagram/feed";
import type { InstagramFeed, InstagramPost } from "@/lib/instagram/types";

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

  for (const url of uniqueUrls) {
    try {
      const post = await fetchInstagramPost(url);
      if (post) posts.push(post);
      else failed.push(url);
    } catch {
      failed.push(url);
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

  return { ok: failed.length === 0, synced: posts.length, failed, feed };
}

export async function discoverAndSyncInstagram(username = "ekconstructions"): Promise<
  SyncInstagramResult & { discoverError?: string; method?: string }
> {
  const discovery = await discoverProfilePostUrls(username);
  const manual = readInstagramPostUrls();
  const merged = [...new Set([...discovery.urls, ...manual])];

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
