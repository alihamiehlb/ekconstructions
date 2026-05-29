/**
 * Extract high-resolution assets from the EK Constructions mockup.
 * Run: node scripts/extract-mockup-assets.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(
  ROOT,
  "assets",
  "mockup.png",
);
const OUT = path.join(ROOT, "public", "images");
const SCALE = 10;

const MOCKUP_SRC =
  "C:/Users/QSCUser/.cursor/projects/c-folders-projects-all-new-ekconsturct/assets/c__Users_QSCUser_AppData_Roaming_Cursor_User_workspaceStorage_f23ffd838ad999b20ab5f5685191ba15_images_image-0bae0ccd-6db6-4208-8645-e61738f65bfb.png";

async function main() {
  fs.mkdirSync(path.join(ROOT, "assets"), { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });

  if (!fs.existsSync(SOURCE)) {
    fs.copyFileSync(MOCKUP_SRC, SOURCE);
  }

  const meta = await sharp(SOURCE).metadata();
  const W = meta.width ?? 419;
  const H = meta.height ?? 446;

  const upscaled = sharp(SOURCE)
    .resize(W * SCALE, H * SCALE, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.2, m1: 1.1, m2: 0.4 });

  const scale = (r) => ({
    left: Math.round(r.left * SCALE),
    top: Math.round(r.top * SCALE),
    width: Math.round(r.width * SCALE),
    height: Math.round(r.height * SCALE),
  });

  const crops = {
    "logo.png": { left: 8, top: 4, width: 122, height: 42 },
    "hero-building.png": { left: 178, top: 32, width: 241, height: 172 },
    "hero-dots.png": { left: 368, top: 48, width: 48, height: 48 },
    "project-1.png": { left: 0, top: 380, width: 84, height: 66 },
    "project-2.png": { left: 84, top: 380, width: 84, height: 66 },
    "project-3.png": { left: 168, top: 380, width: 84, height: 66 },
    "project-4.png": { left: 252, top: 380, width: 84, height: 66 },
    "project-5.png": { left: 336, top: 380, width: 83, height: 66 },
    "icon-window.png": { left: 38, top: 228, width: 28, height: 28 },
    "icon-balustrade.png": { left: 108, top: 228, width: 28, height: 28 },
    "icon-steel.png": { left: 178, top: 228, width: 28, height: 28 },
    "icon-fence.png": { left: 248, top: 228, width: 28, height: 28 },
    "icon-hammer.png": { left: 318, top: 228, width: 28, height: 28 },
  };

  const base = await upscaled.png().toBuffer();

  for (const [name, region] of Object.entries(crops)) {
    const r = scale(region);
    await sharp(base)
      .extract(r)
      .png({ compressionLevel: 6, quality: 100 })
      .toFile(path.join(OUT, name));
    console.log("✓", name, r.width, "x", r.height);
  }

  await upscaled.png().toFile(path.join(OUT, "design-reference.png"));
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
