import { readFileSync } from "fs";

const h = readFileSync("tmp-profile.html", "utf8");
for (const name of ["code", "shortcode", "media_id", "pk"]) {
  const re = new RegExp(`"${name}":"([A-Za-z0-9_-]+)"`, "g");
  const set = new Set([...h.matchAll(re)].map((m) => m[1]));
  console.log(name, set.size, [...set].slice(0, 15));
}
