import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "public/images/ek-logo-onlight.png");
const brandRed = { r: 219, g: 32, b: 34, alpha: 1 };

async function writeSquareIcon(size, outPath, background) {
  await sharp(src)
    .resize(size, size, {
      fit: "contain",
      background,
    })
    .png()
    .toFile(outPath);
}

await mkdir(path.join(root, "app"), { recursive: true });
await mkdir(path.join(root, "public"), { recursive: true });

await writeSquareIcon(32, path.join(root, "app/icon.png"), brandRed);
await writeSquareIcon(180, path.join(root, "app/apple-icon.png"), brandRed);
await writeSquareIcon(32, path.join(root, "public/favicon-32.png"), brandRed);
await writeSquareIcon(16, path.join(root, "public/favicon-16.png"), brandRed);
await writeSquareIcon(180, path.join(root, "public/apple-touch-icon.png"), brandRed);

await sharp(path.join(root, "app/icon.png")).toFile(path.join(root, "app/favicon.ico"));

console.log(
  "Generated app/icon.png, app/apple-icon.png, app/favicon.ico, public/favicon-*.png, public/apple-touch-icon.png",
);
