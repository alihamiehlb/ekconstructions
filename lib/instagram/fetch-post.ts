import { dedupeInstagramImages, isAllowedInstagramImageUrl } from "@/lib/instagram/image-utils";
import {
  descriptionFromCaption,
  parseInstagramOgDescription,
  titleFromCaption,
} from "@/lib/instagram/caption-utils";
import { instagramPermalink, parseInstagramShortcode } from "@/lib/instagram/parse-url";
import type { InstagramPost } from "@/lib/instagram/types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function sessionCookie(): string | undefined {
  const sessionId = process.env.INSTAGRAM_SESSION_ID?.trim();
  if (!sessionId) return undefined;
  return `sessionid=${sessionId}`;
}

function fetchHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "User-Agent": UA,
    Accept: "text/html,application/json",
    "Accept-Language": "en-AU,en;q=0.9",
  };
  const cookie = sessionCookie();
  if (cookie) headers.Cookie = cookie;
  return headers;
}

/** Follow Instagram media redirect to CDN image URL. */
export async function fetchInstagramMediaUrl(shortcode: string): Promise<string | null> {
  const res = await fetch(`https://www.instagram.com/p/${shortcode}/media/?size=l`, {
    headers: fetchHeaders(),
    redirect: "follow",
  });
  if (!res.ok) return null;
  const url = res.url;
  return isAllowedInstagramImageUrl(url) ? url : null;
}

function extractImagesFromHtml(html: string): string[] {
  const raw: string[] = [];

  for (const m of html.matchAll(
    /https:\/\/[^"'\s]*cdninstagram\.com\/[^"'\s]+\.(?:jpg|jpeg|webp)(?:\?[^"'\s]*)?/gi,
  )) {
    raw.push(m[0]);
  }

  for (const m of html.matchAll(
    /https:\/\/[^"'\s]*\.fbcdn\.net\/[^"'\s]+\.(?:jpg|jpeg|webp)(?:\?[^"'\s]*)?/gi,
  )) {
    raw.push(m[0]);
  }

  for (const m of html.matchAll(/"display_url":"([^"]+)"/g)) {
    try {
      raw.push(JSON.parse(`"${m[1]}"`));
    } catch {
      /* skip */
    }
  }

  for (const m of html.matchAll(/"url":"(https:[^"]+)"/g)) {
    const u = m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    if (u.includes("cdninstagram") || u.includes("fbcdn.net")) raw.push(u);
  }

  return dedupeInstagramImages(
    raw.filter((u) => isAllowedInstagramImageUrl(u) && !u.includes("/rsrc.php")),
  );
}

function decodeJsonString(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\u0026/g, "&")
    .replace(/\\r/g, "\r")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"');
}

function captionFromHtml(html: string): string {
  const og = html.match(/property="og:description"\s+content="([^"]*)"/i);
  if (og?.[1]) {
    const parsed = parseInstagramOgDescription(og[1]);
    if (parsed) return parsed.slice(0, 2000);
  }

  const ogAlt = html.match(/content="([^"]*)"\s+property="og:description"/i);
  if (ogAlt?.[1]) {
    const parsed = parseInstagramOgDescription(ogAlt[1]);
    if (parsed) return parsed.slice(0, 2000);
  }

  for (const m of html.matchAll(/"edge_media_to_caption"\s*:\s*\{\s*"edges"\s*:\s*\[\s*\{\s*"node"\s*:\s*\{\s*"text"\s*:\s*"((?:\\.|[^"\\])*)"/g)) {
    const text = decodeJsonString(m[1]).trim();
    if (text) return text.slice(0, 2000);
  }

  for (const m of html.matchAll(/"caption"\s*:\s*"((?:\\.|[^"\\])*)"/g)) {
    const text = decodeJsonString(m[1]).trim();
    if (text && text.length > 3 && !text.startsWith("http")) return text.slice(0, 2000);
  }

  for (const m of html.matchAll(/"accessibility_caption"\s*:\s*"((?:\\.|[^"\\])*)"/g)) {
    const text = decodeJsonString(m[1]).trim();
    if (text) return text.slice(0, 2000);
  }

  const ldJson = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (ldJson?.[1]) {
    try {
      const data = JSON.parse(ldJson[1]) as { caption?: string; description?: string };
      const text = data.caption ?? data.description;
      if (text?.trim()) return text.trim().slice(0, 2000);
    } catch {
      /* skip */
    }
  }

  return "";
}

/** Pull carousel / single-post image URLs from public post HTML. */
export async function fetchInstagramPostImages(shortcode: string): Promise<string[]> {
  const res = await fetch(instagramPermalink(shortcode), {
    headers: fetchHeaders(),
  });

  if (res.ok) {
    const html = await res.text();
    const images = extractImagesFromHtml(html);
    if (images.length > 0) return images.slice(0, 20);
  }

  const single = await fetchInstagramMediaUrl(shortcode);
  return single ? [single] : [];
}

export async function fetchInstagramPost(input: string): Promise<InstagramPost | null> {
  const shortcode = parseInstagramShortcode(input);
  if (!shortcode) return null;

  const permalink = instagramPermalink(shortcode);
  const res = await fetch(permalink, { headers: fetchHeaders() });

  let caption = "";
  let html = "";
  if (res.ok) {
    html = await res.text();
    caption = captionFromHtml(html);
  }

  const images =
    html.length > 0 ? extractImagesFromHtml(html) : await fetchInstagramPostImages(shortcode);

  if (images.length === 0) return null;

  const now = new Date().toISOString();
  const title = titleFromCaption(caption);

  return {
    id: shortcode,
    shortcode,
    permalink,
    caption,
    title: title !== "EK Constructions project" ? title : undefined,
    images,
    thumbnail: images[0],
    isCarousel: images.length > 1,
    syncedAt: now,
  };
}
