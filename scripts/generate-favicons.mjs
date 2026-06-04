import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const brandRed = "#DB2022";
const MASTER_SIZE = 512;

/** Square favicon mark: bold white EK on brand red (readable at 16–32px). */
const svgMaster = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER_SIZE}" height="${MASTER_SIZE}" viewBox="0 0 ${MASTER_SIZE} ${MASTER_SIZE}">
  <rect width="${MASTER_SIZE}" height="${MASTER_SIZE}" fill="${brandRed}"/>
  <text
    x="256"
    y="272"
    font-family="Montserrat, 'Segoe UI', Helvetica, Arial, sans-serif"
    font-weight="700"
    font-size="248"
    letter-spacing="-6"
    fill="#FFFFFF"
    text-anchor="middle"
    dominant-baseline="middle"
  >EK</text>
</svg>`;

const pngOptions = { compressionLevel: 9 };

async function renderMasterPng() {
  return sharp(Buffer.from(svgMaster), { density: 144 })
    .resize(MASTER_SIZE, MASTER_SIZE)
    .png(pngOptions)
    .withMetadata(false)
    .toBuffer();
}

async function resizePng(master, size) {
  return sharp(master)
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .png(pngOptions)
    .withMetadata(false)
    .toBuffer();
}

/** Multi-size ICO with embedded PNG frames (16, 32, 48). */
async function writeMultiSizeIco(entries, outPath) {
  const sorted = [...entries].sort((a, b) => a.size - b.size);
  const count = sorted.length;
  const headerBytes = 6;
  const dirEntryBytes = 16;
  const dataOffset = headerBytes + dirEntryBytes * count;

  let offset = dataOffset;
  const dir = [];
  for (const { size, buffer } of sorted) {
    dir.push({ size, buffer, offset });
    offset += buffer.length;
  }

  const file = Buffer.alloc(offset);
  let pos = 0;
  file.writeUInt16LE(0, pos);
  pos += 2;
  file.writeUInt16LE(1, pos);
  pos += 2;
  file.writeUInt16LE(count, pos);
  pos += 2;

  for (const { size, buffer, offset: imgOffset } of dir) {
    const dim = size >= 256 ? 0 : size;
    file.writeUInt8(dim, pos);
    pos += 1;
    file.writeUInt8(dim, pos);
    pos += 1;
    file.writeUInt8(0, pos);
    pos += 1;
    file.writeUInt8(0, pos);
    pos += 1;
    file.writeUInt16LE(1, pos);
    pos += 2;
    file.writeUInt16LE(32, pos);
    pos += 2;
    file.writeUInt32LE(buffer.length, pos);
    pos += 4;
    file.writeUInt32LE(imgOffset, pos);
    pos += 4;
  }

  for (const { buffer } of dir) {
    buffer.copy(file, pos);
    pos += buffer.length;
  }

  await writeFile(outPath, file);
}

async function writePng(buffer, outPath) {
  await sharp(buffer).toFile(outPath);
}

const master = await renderMasterPng();

await mkdir(path.join(root, "app"), { recursive: true });
await mkdir(path.join(root, "public"), { recursive: true });

const outputs = [
  { size: 32, paths: [path.join(root, "app/icon.png"), path.join(root, "public/favicon-32.png")] },
  { size: 16, paths: [path.join(root, "public/favicon-16.png")] },
  { size: 180, paths: [path.join(root, "app/apple-icon.png"), path.join(root, "public/apple-touch-icon.png")] },
];

for (const { size, paths } of outputs) {
  const buf = await resizePng(master, size);
  for (const outPath of paths) {
    await writePng(buf, outPath);
  }
}

const icoEntries = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, buffer: await resizePng(master, size) })),
);
await writeMultiSizeIco(icoEntries, path.join(root, "app/favicon.ico"));

console.log(
  "Generated square EK mark favicons from 512px master:",
  "app/icon.png, app/apple-icon.png, app/favicon.ico (16/32/48),",
  "public/favicon-16.png, public/favicon-32.png, public/apple-touch-icon.png",
);
