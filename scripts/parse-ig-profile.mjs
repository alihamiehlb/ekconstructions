import fs from "fs";

const html = fs.readFileSync("tmp-ig.html", "utf8");
const shorts = [...html.matchAll(/"shortcode":"([A-Za-z0-9_-]+)"/g)].map((m) => m[1]);
const codes = [...new Set(shorts)];
console.log("shortcodes", codes.length, codes.slice(0, 25));
const imgs = [
  ...html.matchAll(/https:\/\/[^"']*cdninstagram\.com[^"']*\.(jpg|webp)/gi),
].map((m) => m[0]);
console.log("cdn imgs", [...new Set(imgs)].length);
