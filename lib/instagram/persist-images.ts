import type { InstagramPost } from "@/lib/instagram/types";
import { fetchInstagramPostDetailed } from "@/lib/instagram/fetch-post";
import { createClient } from "@supabase/supabase-js";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function storageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isPersistedMediaUrl(url: string): boolean {
  return /\.supabase\.co\/storage\/v1\/object\/public\/media\//i.test(url);
}

export function isExpiringCdnUrl(url: string): boolean {
  return /cdninstagram\.com|fbcdn\.net/i.test(url);
}

function extForContentType(contentType: string): string {
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png")) return "png";
  return "jpg";
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "image/*" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    return { buffer: Buffer.from(await res.arrayBuffer()), contentType };
  } catch {
    return null;
  }
}

async function uploadImage(
  shortcode: string,
  index: number,
  buffer: Buffer,
  contentType: string,
): Promise<string | null> {
  const client = storageClient();
  if (!client) return null;

  const ext = extForContentType(contentType);
  const objectPath = `instagram/${shortcode}/${index}.${ext}`;

  const { error } = await client.storage.from("media").upload(objectPath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error("instagram persist upload:", error.message);
    return null;
  }

  return client.storage.from("media").getPublicUrl(objectPath).data.publicUrl;
}

/** Download Instagram images and store on Supabase — URLs never expire. */
export async function persistInstagramPost(post: InstagramPost): Promise<InstagramPost> {
  if (!isSupabaseStorageConfigured()) return post;
  if (post.images.length > 0 && post.images.every(isPersistedMediaUrl)) return post;

  let sourceUrls = post.images.length ? post.images : [post.thumbnail];

  if (sourceUrls.every(isExpiringCdnUrl) || sourceUrls.some((u) => !u)) {
    const { post: fresh } = await fetchInstagramPostDetailed(post.permalink);
    if (fresh?.images.length) {
      sourceUrls = fresh.images;
      post = { ...post, caption: fresh.caption || post.caption, title: fresh.title ?? post.title };
    }
  }

  const persisted: string[] = [];

  for (let i = 0; i < sourceUrls.length; i++) {
    const downloaded = await downloadImage(sourceUrls[i]);
    if (!downloaded) {
      persisted.push(sourceUrls[i]);
      continue;
    }
    const publicUrl = await uploadImage(post.shortcode, i, downloaded.buffer, downloaded.contentType);
    persisted.push(publicUrl ?? sourceUrls[i]);
  }

  const images = persisted.filter(Boolean);
  if (images.length === 0) return post;

  return {
    ...post,
    images,
    thumbnail: images[0],
  };
}

export async function persistInstagramFeedPosts(posts: InstagramPost[]): Promise<InstagramPost[]> {
  if (!isSupabaseStorageConfigured()) return posts;
  const results: InstagramPost[] = [];
  for (const post of posts) {
    results.push(await persistInstagramPost(post));
  }
  return results;
}

/** Re-upload any posts still pointing at expiring Instagram CDN links. */
export async function refreshExpiringPosts(posts: InstagramPost[]): Promise<InstagramPost[]> {
  if (!isSupabaseStorageConfigured()) return posts;

  const needsRefresh = posts.some(
    (p) => p.images.some((u) => isExpiringCdnUrl(u) && !isPersistedMediaUrl(u)),
  );
  if (!needsRefresh) return posts;

  return persistInstagramFeedPosts(posts);
}
