/** Deduplicate Instagram CDN URLs (carousel posts repeat the same file in HTML). */
export function dedupeInstagramImages(urls: string[]): string[] {
  const seen = new Map<string, string>();

  for (const raw of urls) {
    const url = raw.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    const idMatch = url.match(/\/(\d{8,}_\d{8,})_/);
    const key = idMatch?.[1] ?? url.split("?")[0] ?? url;
    if (!seen.has(key)) seen.set(key, url);
  }

  return [...seen.values()];
}

export function isAllowedInstagramImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (/\.cdninstagram\.com$/i.test(u.hostname) ||
        /\.fbcdn\.net$/i.test(u.hostname) ||
        /^instagram\./i.test(u.hostname))
    );
  } catch {
    return false;
  }
}
