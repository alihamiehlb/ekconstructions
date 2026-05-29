/**
 * Sync Instagram posts from content/instagram-post-urls.json
 * Usage: node scripts/sync-instagram.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const urlsPath = join(root, "content", "instagram-post-urls.json");
const feedPath = join(root, "content", "instagram-feed.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function parseShortcode(input) {
  const t = input.trim();
  for (const re of [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/i,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/i,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/i,
  ]) {
    const m = t.match(re);
    if (m) return m[1];
  }
  return /^[A-Za-z0-9_-]+$/.test(t) ? t : null;
}

async function mediaUrl(shortcode) {
  const res = await fetch(`https://www.instagram.com/p/${shortcode}/media/?size=l`, {
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  return res.ok ? res.url : null;
}

async function postImages(shortcode) {
  const permalink = `https://www.instagram.com/p/${shortcode}/`;
  const res = await fetch(permalink, { headers: { "User-Agent": UA } });
  if (res.ok) {
    const html = await res.text();
    const found = [
      ...html.matchAll(
        /https:\/\/[^"'\s]*cdninstagram\.com\/[^"'\s]+\.(?:jpg|jpeg|webp)(?:\?[^"'\s]*)?/gi,
      ),
    ]
      .map((m) => m[0].replace(/\\u0026/g, "&"))
      .filter((u) => !u.includes("static.cdninstagram.com"));
    const unique = [...new Set(found)];
    if (unique.length) return unique.slice(0, 12);
  }
  const single = await mediaUrl(shortcode);
  return single ? [single] : [];
}

async function main() {
  const urls = JSON.parse(readFileSync(urlsPath, "utf8"));
  if (!Array.isArray(urls) || urls.length === 0) {
    console.log("Add post URLs to content/instagram-post-urls.json first.");
    process.exit(1);
  }

  const posts = [];
  for (const url of urls) {
    const shortcode = parseShortcode(url);
    if (!shortcode) {
      console.warn("Skip:", url);
      continue;
    }
    const images = await postImages(shortcode);
    if (!images.length) {
      console.warn("No images:", url);
      continue;
    }
    posts.push({
      id: shortcode,
      shortcode,
      permalink: `https://www.instagram.com/p/${shortcode}/`,
      caption: "",
      images,
      thumbnail: images[0],
      isCarousel: images.length > 1,
      syncedAt: new Date().toISOString(),
    });
    console.log("OK", shortcode, images.length, "image(s)");
    await new Promise((r) => setTimeout(r, 500));
  }

  const feed = {
    username: "ekconstructions",
    profileUrl: "https://www.instagram.com/ekconstructions/",
    syncedAt: new Date().toISOString(),
    posts,
  };

  if (!existsSync(dirname(feedPath))) mkdirSync(dirname(feedPath), { recursive: true });
  writeFileSync(feedPath, JSON.stringify(feed, null, 2));
  console.log(`Wrote ${posts.length} posts to content/instagram-feed.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
