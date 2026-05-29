/** Extract Instagram post/reel shortcode from a URL or bare code. */
export function parseInstagramShortcode(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/i,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/i,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;
  return null;
}

export function instagramPermalink(shortcode: string): string {
  return `https://www.instagram.com/p/${shortcode}/`;
}

/** Strip query params and normalize to canonical permalink. */
export function normalizeInstagramUrl(input: string): string {
  const trimmed = input.trim();
  const shortcode = parseInstagramShortcode(trimmed);
  if (!shortcode) return trimmed;
  return instagramPermalink(shortcode);
}
