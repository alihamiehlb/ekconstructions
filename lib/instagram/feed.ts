import {
  isSupabaseFeedConfigured,
  readInstagramFeedFromSupabase,
  writeInstagramFeedToSupabase,
} from "@/lib/instagram/supabase-feed";
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
};

function readInstagramFeedFromFile(): InstagramFeed {
  try {
    if (!fs.existsSync(FEED_PATH)) return { ...DEFAULT_FEED };
    const raw = JSON.parse(fs.readFileSync(FEED_PATH, "utf8")) as InstagramFeed;
    return {
      ...DEFAULT_FEED,
      ...raw,
      posts: Array.isArray(raw.posts) ? raw.posts : [],
    };
  } catch {
    return { ...DEFAULT_FEED };
  }
}

function writeInstagramFeedToFile(feed: InstagramFeed): void {
  const dir = path.dirname(FEED_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2), "utf8");
}

export function getInstagramFeedPath(): string {
  return FEED_PATH;
}

/** Supabase (production) first, then committed JSON file (local / fallback). */
export async function readInstagramFeed(): Promise<InstagramFeed> {
  if (isSupabaseFeedConfigured()) {
    const remote = await readInstagramFeedFromSupabase();
    if (remote && remote.posts.length > 0) return remote;
  }
  return readInstagramFeedFromFile();
}

export function readInstagramFeedSync(): InstagramFeed {
  return readInstagramFeedFromFile();
}

export async function writeInstagramFeed(feed: InstagramFeed): Promise<void> {
  writeInstagramFeedToFile(feed);

  if (isSupabaseFeedConfigured()) {
    await writeInstagramFeedToSupabase(feed);
  }
}

export function readInstagramPostUrls(): string[] {
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

export function writeInstagramPostUrls(urls: string[]): void {
  fs.writeFileSync(URLS_PATH, JSON.stringify(urls, null, 2), "utf8");
}
