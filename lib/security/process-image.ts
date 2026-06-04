import sharp from "sharp";

const MAX_INPUT_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 2400;
const ALLOWED_FORMATS = new Set(["jpeg", "jpg", "png", "webp", "gif", "avif"]);

export type ProcessedImage = {
  buffer: Buffer;
  contentType: "image/webp";
  ext: "webp";
};

/** Validate via sharp decode, strip metadata, output WebP for storage. */
export async function processImageForStorage(input: Buffer): Promise<ProcessedImage> {
  if (input.length > MAX_INPUT_BYTES) {
    throw new Error("Image must be under 5 MB.");
  }

  let meta: sharp.Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new Error("File is not a valid image.");
  }

  const format = meta.format?.toLowerCase();
  if (!format || !ALLOWED_FORMATS.has(format)) {
    throw new Error("Only JPEG, PNG, WebP, GIF, or AVIF images are allowed.");
  }

  const webpBuffer = await sharp(input)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  if (webpBuffer.length > MAX_INPUT_BYTES) {
    throw new Error("Processed image exceeds size limit.");
  }

  return { buffer: webpBuffer, contentType: "image/webp", ext: "webp" };
}
