import type { InstagramFeed } from "@/lib/instagram/types";
import { createClient } from "@supabase/supabase-js";

const ROW_ID = "main";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseFeedConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function readInstagramFeedFromSupabase(): Promise<InstagramFeed | null> {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("instagram_feed")
    .select("data, updated_at")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("readInstagramFeedFromSupabase:", error.message);
    return null;
  }
  if (!data?.data) return null;

  const feed = data.data as InstagramFeed;
  return {
    username: feed.username ?? "ekconstructions",
    profileUrl: feed.profileUrl ?? "https://www.instagram.com/ekconstructions/",
    syncedAt: feed.syncedAt ?? data.updated_at ?? "",
    posts: Array.isArray(feed.posts) ? feed.posts : [],
  };
}

export async function writeInstagramFeedToSupabase(feed: InstagramFeed): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const { error } = await client.from("instagram_feed").upsert({
    id: ROW_ID,
    data: feed,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("writeInstagramFeedToSupabase:", error.message);
    return false;
  }
  return true;
}
