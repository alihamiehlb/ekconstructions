/** Parse Instagram post/reel URL into an embed iframe src. */
export function getInstagramEmbedUrl(input: string | undefined): string | null {
  if (!input?.trim()) return null;

  const trimmed = input.trim();

  if (trimmed.includes("/embed")) return trimmed;

  const reel = trimmed.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/i);
  if (reel) return `https://www.instagram.com/reel/${reel[1]}/embed`;

  const post = trimmed.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  if (post) return `https://www.instagram.com/p/${post[1]}/embed`;

  const tv = trimmed.match(/instagram\.com\/tv\/([A-Za-z0-9_-]+)/i);
  if (tv) return `https://www.instagram.com/tv/${tv[1]}/embed`;

  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return `https://www.instagram.com/reel/${trimmed}/embed`;
  }

  return null;
}

export function getInstagramVideoEmbedUrl(): string | null {
  return getInstagramEmbedUrl(
    process.env.NEXT_PUBLIC_INSTAGRAM_VIDEO_URL ??
      process.env.NEXT_PUBLIC_INSTAGRAM_REEL_URL,
  );
}
