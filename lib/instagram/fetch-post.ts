import { dedupeInstagramImages, isAllowedInstagramImageUrl } from "@/lib/instagram/image-utils";
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

function captionFromHtml(html: string): string {
  const og = html.match(/property="og:description"\s+content="([^"]*)"/i);
  if (og?.[1]) return decodeHtmlEntities(og[1]).slice(0, 500);
  const alt = html.match(/"caption":"((?:\\.|[^"\\])*)"/);
  if (alt?.[1]) return decodeHtmlEntities(alt[1].replace(/\\n/g, " ")).slice(0, 500);
  return "";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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
  return {
    id: shortcode,
    shortcode,
    permalink,
    caption,
    images,
    thumbnail: images[0],
    isCarousel: images.length > 1,
    syncedAt: now,
  };
}
