/** Hostnames allowed for server-side image fetches (Instagram CDN only). */
const ALLOWED_IMAGE_HOSTS = [
  "cdninstagram.com",
  "fbcdn.net",
] as const;

export function isAllowedRemoteImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_IMAGE_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}
