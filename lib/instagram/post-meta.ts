import fs from "fs";
import path from "path";

export type InstagramPostMeta = {
  category?: string;
  title?: string;
  description?: string;
};

const META_PATH = path.join(process.cwd(), "content", "instagram-post-meta.json");

let cache: Record<string, InstagramPostMeta> | null = null;

function loadMeta(): Record<string, InstagramPostMeta> {
  if (cache) return cache;
  try {
    if (!fs.existsSync(META_PATH)) {
      cache = {};
      return cache;
    }
    cache = JSON.parse(fs.readFileSync(META_PATH, "utf8")) as Record<
      string,
      InstagramPostMeta
    >;
    return cache;
  } catch {
    cache = {};
    return cache;
  }
}

export function getInstagramPostMeta(shortcode: string): InstagramPostMeta | undefined {
  return loadMeta()[shortcode];
}
