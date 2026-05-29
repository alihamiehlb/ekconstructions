import { dedupeInstagramImages, isAllowedInstagramImageUrl } from "@/lib/instagram/image-utils";
import {
  parseInstagramOgDescription,
  titleFromCaption,
} from "@/lib/instagram/caption-utils";
import { instagramPermalink, parseInstagramShortcode } from "@/lib/instagram/parse-url";
import type { InstagramPost } from "@/lib/instagram/types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const IG_APP_ID = "936619743392459";

export type FetchPostResult = {
  post: InstagramPost | null;
  error?: string;
};

function sessionCookie(): string | undefined {
  const sessionId = process.env.INSTAGRAM_SESSION_ID?.trim();
  if (!sessionId) return undefined;
  const igDid = process.env.INSTAGRAM_IG_DID?.trim();
  return igDid ? `sessionid=${sessionId}; ig_did=${igDid}` : `sessionid=${sessionId}`;
}

function fetchHeaders(extra?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = {
    "User-Agent": UA,
    Accept: "text/html,application/json",
    "Accept-Language": "en-AU,en;q=0.9",
    "X-IG-App-ID": IG_APP_ID,
    ...extra,
  };
  const cookie = sessionCookie();
  if (cookie) headers.Cookie = cookie;
  return headers;
}

function decodeJsonString(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\u0026/g, "&")
    .replace(/\\r/g, "\r")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"');
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

  const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/i);
  if (ogImage?.[1]) {
    const url = ogImage[1].replace(/&amp;/g, "&");
    if (isAllowedInstagramImageUrl(url)) raw.push(url);
  }

  return dedupeInstagramImages(
    raw.filter((u) => isAllowedInstagramImageUrl(u) && !u.includes("/rsrc.php")),
  );
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

  return "";
}

async function fetchInstagramMediaUrl(shortcode: string): Promise<string | null> {
  const res = await fetch(`https://www.instagram.com/p/${shortcode}/media/?size=l`, {
    headers: fetchHeaders(),
    redirect: "follow",
  });
  if (!res.ok) return null;
  const url = res.url;
  return isAllowedInstagramImageUrl(url) ? url : null;
}

/** Public oEmbed — often works when HTML scrape is blocked on server IPs. */
async function fetchViaOembed(permalink: string): Promise<{
  thumbnail?: string;
  title?: string;
  caption?: string;
} | null> {
  const endpoints = [
    `https://api.instagram.com/oembed?url=${encodeURIComponent(permalink)}&omitscript=true`,
    `https://www.instagram.com/oembed?url=${encodeURIComponent(permalink)}&omitscript=true`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        thumbnail_url?: string;
        title?: string;
        author_name?: string;
      };
      if (data.thumbnail_url && isAllowedInstagramImageUrl(data.thumbnail_url)) {
        return {
          thumbnail: data.thumbnail_url,
          title: data.title,
          caption: data.title,
        };
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

async function fetchViaEmbedPage(shortcode: string): Promise<string[]> {
  try {
    const res = await fetch(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
      headers: fetchHeaders(),
    });
    if (!res.ok) return [];
    const html = await res.text();
    return extractImagesFromHtml(html);
  } catch {
    return [];
  }
}

export async function fetchInstagramPost(input: string): Promise<InstagramPost | null> {
  const result = await fetchInstagramPostDetailed(input);
  return result.post;
}

export async function fetchInstagramPostDetailed(input: string): Promise<FetchPostResult> {
  const shortcode = parseInstagramShortcode(input);
  if (!shortcode) {
    return { post: null, error: "Invalid Instagram URL — use a link like instagram.com/p/ABC123/" };
  }

  const permalink = instagramPermalink(shortcode);
  let caption = "";
  let html = "";
  let images: string[] = [];

  try {
    const res = await fetch(permalink, { headers: fetchHeaders() });
    if (res.ok) {
      html = await res.text();
      caption = captionFromHtml(html);
      images = extractImagesFromHtml(html);
    }
  } catch {
    /* fall through to other methods */
  }

  if (images.length === 0 && html.length > 0) {
    images = await fetchViaEmbedPage(shortcode);
  }

  if (images.length === 0) {
    const media = await fetchInstagramMediaUrl(shortcode);
    if (media) images = [media];
  }

  if (images.length === 0) {
    const oembed = await fetchViaOembed(permalink);
    if (oembed?.thumbnail) {
      images = [oembed.thumbnail];
      if (!caption && oembed.caption) caption = oembed.caption;
    }
  }

  if (images.length === 0) {
    const hint = sessionCookie()
      ? "Could not load images — post may be private or URL invalid."
      : "Instagram blocked server access. Add INSTAGRAM_SESSION_ID in Vercel env, or try again.";
    return { post: null, error: hint };
  }

  const now = new Date().toISOString();
  const title = titleFromCaption(caption);

  return {
    post: {
      id: shortcode,
      shortcode,
      permalink,
      caption,
      title: title !== "EK Constructions project" ? title : undefined,
      images,
      thumbnail: images[0],
      isCarousel: images.length > 1,
      syncedAt: now,
    },
  };
}

/** @deprecated use fetchInstagramPostDetailed */
export async function fetchInstagramPostImages(shortcode: string): Promise<string[]> {
  const result = await fetchInstagramPostDetailed(
    `https://www.instagram.com/p/${shortcode}/`,
  );
  return result.post?.images ?? [];
}
