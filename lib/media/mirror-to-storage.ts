import { createClient } from "@supabase/supabase-js";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function extensionForContentType(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

function isAlreadyOnSupabase(url: string, supabaseHost: string): boolean {
  try {
    return new URL(url).hostname === new URL(supabaseHost).hostname;
  } catch {
    return false;
  }
}

/** Download a remote image and store it in Supabase Storage (stable public URL). */
export async function mirrorRemoteImageToStorage(remoteUrl: string): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase is not configured — cannot store Instagram images. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (isAlreadyOnSupabase(remoteUrl, supabaseUrl)) {
    return remoteUrl;
  }

  const res = await fetch(remoteUrl, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: "https://www.instagram.com/",
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    throw new Error(`Could not download image (${res.status}). Try Upload image instead.`);
  }

  const contentType = (res.headers.get("content-type") ?? "image/jpeg").split(";")[0].trim();
  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error("Downloaded file is not a supported image type.");
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image is over 5 MB. Upload a smaller file instead.");
  }

  const ext = extensionForContentType(contentType);
  const objectPath = `gallery/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { error } = await client.storage.from("media").upload(objectPath, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error("mirror-to-storage upload:", error);
    throw new Error("Could not save image to storage. Check the Supabase media bucket.");
  }

  const { data } = client.storage.from("media").getPublicUrl(objectPath);
  return data.publicUrl;
}
