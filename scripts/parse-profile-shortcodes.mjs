import { readFileSync } from "fs";

const html = readFileSync("tmp-profile.html", "utf8");

const patterns = [
  /"shortcode":"([A-Za-z0-9_-]+)"/g,
  /instagram\.com\/p\/([A-Za-z0-9_-]+)/g,
  /instagram\.com\/reel\/([A-Za-z0-9_-]+)/g,
];

const codes = new Set();
for (const re of patterns) {
  for (const m of html.matchAll(re)) codes.add(m[1]);
}

console.log("count", codes.size);
console.log([...codes].join("\n"));
