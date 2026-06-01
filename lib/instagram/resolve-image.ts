/**
 * Resolve public Instagram post/reel URLs to a direct CDN image URL.
 * Post page HTML often has no og:image for server fetches; the /media/ redirect works.
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

export function isInstagramCdnImageUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("cdninstagram.com") || host.includes("fbcdn.net");
  } catch {
    return false;
  }
}

/** Instagram legacy media redirect — returns a direct jpg/webp URL. */
export function buildInstagramMediaUrl(postUrl: string): string {
  const normalized = normalizeInstagramPostUrl(postUrl);
  const parsed = new URL(normalized);
  const match = parsed.pathname.match(POST_PATH);
  if (!match) throw new Error("Invalid Instagram post URL.");

  const type = match[1];
  const code = match[2];
  const imgIndex = parsed.searchParams.get("img_index");
  let mediaUrl = `https://www.instagram.com/${type}/${code}/media/?size=l`;
  if (imgIndex) {
    mediaUrl += `&img_index=${encodeURIComponent(imgIndex)}`;
  }
  return mediaUrl;
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
    if (match?.[1] && isInstagramCdnImageUrl(decodeHtmlAttr(match[1]))) {
      return decodeHtmlAttr(match[1]);
    }
  }
  return null;
}

async function resolveViaMediaRedirect(postUrl: string): Promise<string | null> {
  const mediaUrl = buildInstagramMediaUrl(postUrl);

  const res = await fetch(mediaUrl, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      "Accept-Language": "en-AU,en;q=0.9",
      Referer: normalizeInstagramPostUrl(postUrl),
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (isInstagramCdnImageUrl(res.url)) {
    return res.url;
  }

  const location = res.headers.get("location");
  if (location && isInstagramCdnImageUrl(location)) {
    return location;
  }

  return null;
}

async function resolveViaOgImage(postUrl: string): Promise<string | null> {
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

  if (!res.ok) return null;

  const html = await res.text();
  return extractOgImage(html);
}

export async function resolveInstagramPostImage(postUrl: string): Promise<string> {
  const viaMedia = await resolveViaMediaRedirect(postUrl);
  if (viaMedia) return viaMedia;

  const viaOg = await resolveViaOgImage(postUrl);
  if (viaOg) return viaOg;

  throw new Error(
    "Could not fetch the image from Instagram. The post may be private, or Instagram blocked the request — try Upload image instead.",
  );
}

export async function resolveGalleryImageSource(src: string): Promise<string> {
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (isInstagramPostUrl(trimmed)) {
    return resolveInstagramPostImage(trimmed);
  }
  return trimmed;
}
