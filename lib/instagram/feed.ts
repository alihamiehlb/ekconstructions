import {
  isSupabaseFeedConfigured,
  readInstagramFeedFromSupabase,
  writeInstagramFeedToSupabase,
} from "@/lib/instagram/supabase-feed";
import { refreshExpiringPosts } from "@/lib/instagram/persist-images";
import type { InstagramFeed } from "@/lib/instagram/types";
import fs from "fs";
import path from "path";

const FEED_PATH = path.join(process.cwd(), "content", "instagram-feed.json");
const URLS_PATH = path.join(process.cwd(), "content", "instagram-post-urls.json");

const DEFAULT_FEED: InstagramFeed = {
  username: "ekconstructions",
  profileUrl: "https://www.instagram.com/ekconstructions/",
  syncedAt: "",
  posts: [],
  savedUrls: [],
};

function readInstagramFeedFromFile(): InstagramFeed {
  try {
    if (!fs.existsSync(FEED_PATH)) return { ...DEFAULT_FEED };
    const raw = JSON.parse(fs.readFileSync(FEED_PATH, "utf8")) as InstagramFeed;
    return {
      ...DEFAULT_FEED,
      ...raw,
      posts: Array.isArray(raw.posts) ? raw.posts : [],
      savedUrls: Array.isArray(raw.savedUrls) ? raw.savedUrls : readUrlsFromLegacyFile(),
    };
  } catch {
    return { ...DEFAULT_FEED, savedUrls: readUrlsFromLegacyFile() };
  }
}

function readUrlsFromLegacyFile(): string[] {
  try {
    if (!fs.existsSync(URLS_PATH)) return [];
    const raw = JSON.parse(fs.readFileSync(URLS_PATH, "utf8")) as unknown;
    if (Array.isArray(raw)) {
      return raw.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    }
    return [];
  } catch {
    return [];
  }
}

function writeInstagramFeedToFile(feed: InstagramFeed): void {
  const dir = path.dirname(FEED_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2), "utf8");
}

function writeUrlsToLegacyFile(urls: string[]): void {
  fs.writeFileSync(URLS_PATH, JSON.stringify(urls, null, 2), "utf8");
}

export function getInstagramFeedPath(): string {
  return FEED_PATH;
}

/** Supabase (production) first, then committed JSON file (local / fallback). */
export async function readInstagramFeed(): Promise<InstagramFeed> {
  let feed: InstagramFeed;

  if (isSupabaseFeedConfigured()) {
    const remote = await readInstagramFeedFromSupabase();
    if (remote) {
      const fileFallback = readInstagramFeedFromFile();
      feed = {
        ...remote,
        savedUrls:
          remote.savedUrls?.length ? remote.savedUrls : fileFallback.savedUrls ?? [],
      };
    } else {
      feed = readInstagramFeedFromFile();
    }
  } else {
    feed = readInstagramFeedFromFile();
  }

  if (feed.posts.length > 0 && isSupabaseFeedConfigured()) {
    const refreshed = await refreshExpiringPosts(feed.posts);
    const changed = refreshed.some((p, i) => p.thumbnail !== feed.posts[i]?.thumbnail);
    if (changed) {
      feed = { ...feed, posts: refreshed, syncedAt: new Date().toISOString() };
      try {
        await writeInstagramFeed(feed);
      } catch {
        /* still return refreshed posts for this request */
      }
    }
  }

  return feed;
}

export function readInstagramFeedSync(): InstagramFeed {
  return readInstagramFeedFromFile();
}

export async function writeInstagramFeed(feed: InstagramFeed): Promise<void> {
  if (isSupabaseFeedConfigured()) {
    const ok = await writeInstagramFeedToSupabase(feed);
    if (!ok) {
      throw new Error(
        "Could not save Instagram feed to Supabase. Check SUPABASE_SERVICE_ROLE_KEY and the instagram_feed table.",
      );
    }
  }

  try {
    writeInstagramFeedToFile(feed);
    if (feed.savedUrls?.length) writeUrlsToLegacyFile(feed.savedUrls);
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: "warn",
        source: "instagram.feed",
        message: "Skipped local file write (read-only filesystem)",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    if (!isSupabaseFeedConfigured()) {
      throw new Error(
        "Cannot save Instagram feed: filesystem is read-only and Supabase is not configured.",
      );
    }
  }
}

export async function readInstagramPostUrls(): Promise<string[]> {
  const feed = await readInstagramFeed();
  if (feed.savedUrls?.length) return feed.savedUrls;
  return readUrlsFromLegacyFile();
}

/** @deprecated Use feed.savedUrls via writeInstagramFeed */
export function writeInstagramPostUrls(urls: string[]): void {
  try {
    writeUrlsToLegacyFile(urls);
  } catch {
    /* Vercel — URLs are stored in Supabase feed.savedUrls */
  }
}
