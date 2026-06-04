import { assertAdminRole } from "@/lib/auth";
import { processImageForStorage } from "@/lib/security/process-image";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { logSecurityEvent } from "@/lib/security/audit";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await assertAdminRole(["admin", "editor"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    requireJson: false,
    rateLimit: { key: "admin-upload", max: 20, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add URL and service role key to env." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
  }

  let processed;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    processed = await processImageForStorage(buffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid image file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const objectPath = `gallery/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${processed.ext}`;

  const client = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await client.storage.from("media").upload(objectPath, processed.buffer, {
    contentType: processed.contentType,
    upsert: false,
  });

  if (error) {
    console.error("upload error:", error);
    return NextResponse.json({ error: "Upload failed. Check Supabase Storage bucket 'media'." }, { status: 503 });
  }

  const { data: pub } = client.storage.from("media").getPublicUrl(objectPath);

  await logSecurityEvent({
    type: "cms_upload",
    ip: getClientIp(request),
    detail: objectPath,
  });

  return NextResponse.json({
    url: pub.publicUrl,
    path: objectPath,
  });
}
