const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const code = process.argv[2] || "DW3rM9qmE-K";
const r = await fetch(`https://www.instagram.com/p/${code}/`, { headers: { "User-Agent": UA } });
const h = await r.text();

const display = [
  ...h.matchAll(/"display_url":"([^"]+)"/g),
].map((m) => JSON.parse(`"${m[1]}"`));

const candidates = [
  ...h.matchAll(/https:\/\/[^"'\s]*cdninstagram\.com\/[^"'\s]+\.(?:jpg|jpeg|webp)/gi),
].map((m) => m[0].replace(/\\u0026/g, "&"));

console.log("display_url count", new Set(display).size);
const unique = [...new Set(candidates)].filter(
  (u) => !u.includes("static.cdninstagram.com") && !u.includes("/rsrc.php"),
);
console.log("cdn count", unique.length);
for (const u of unique) console.log(u.slice(0, 100));
console.log("sidecar", h.includes("edge_sidecar_to_children"));
