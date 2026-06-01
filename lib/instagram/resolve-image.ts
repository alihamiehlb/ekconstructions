/**
 * Resolve public Instagram post/reel URLs to a direct CDN image URL (og:image).
 * Post page URLs must not be used as img src — they are resolved on save.
 */

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const POST_PATH = /^\/(p|reel|tv)\/([A-Za-z0-9_-]+)/;

export function isInstagramPostUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, "");
    if (host !== "instagram.com") return false;
    return POST_PATH.test(parsed.pathname);
  } catch {
    return false;
  }
}

/** Normalize to https://www.instagram.com/p/SHORTCODE/ preserving img_index. */
export function normalizeInstagramPostUrl(url: string): string {
  const trimmed = url.trim();
  const parsed = new URL(trimmed);
  const match = parsed.pathname.match(POST_PATH);
  if (!match) return trimmed;

  const type = match[1];
  const code = match[2];
  const base = `https://www.instagram.com/${type}/${code}/`;
  const imgIndex = parsed.searchParams.get("img_index");
  if (imgIndex) {
    return `${base}?img_index=${encodeURIComponent(imgIndex)}`;
  }
  return base;
}

function decodeHtmlAttr(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractOgImage(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:image"/i,
    /property='og:image'\s+content='([^']+)'/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]?.includes("cdninstagram.com")) {
      return decodeHtmlAttr(match[1]);
    }
  }
  return null;
}

export async function resolveInstagramPostImage(postUrl: string): Promise<string> {
  const normalized = normalizeInstagramPostUrl(postUrl);

  const res = await fetch(normalized, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-AU,en;q=0.9",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    throw new Error(`Instagram returned ${res.status}. The post may be private or unavailable.`);
  }

  const html = await res.text();
  const imageUrl = extractOgImage(html);
  if (!imageUrl) {
    throw new Error("Could not find an image on that Instagram post.");
  }

  return imageUrl;
}

export async function resolveGalleryImageSource(src: string): Promise<string> {
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (isInstagramPostUrl(trimmed)) {
    return resolveInstagramPostImage(trimmed);
  }
  return trimmed;
}
