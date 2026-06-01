import { getDefaultCms } from "@/lib/cms/defaults";
import { parseStoredCms } from "@/lib/cms/parse-stored-cms";
import type { CmsData } from "@/lib/cms/types";
import { cmsSchema } from "@/lib/cms/schema";
import { createClient } from "@supabase/supabase-js";

const CMS_ROW_ID = "main";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseCmsConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function readCmsFromSupabase(): Promise<CmsData | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data: row, error } = await client
    .from("cms_content")
    .select("data, updated_at")
    .eq("id", CMS_ROW_ID)
    .maybeSingle();

  if (error) throw error;
  if (!row?.data) return null;

  return parseStoredCms(row.data, row.updated_at);
}

export async function writeCmsToSupabase(data: CmsData): Promise<void> {
  const client = getAdminClient();
  if (!client) throw new Error("Supabase not configured");

  const validated = cmsSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(`CMS validation failed: ${JSON.stringify(validated.error.flatten())}`);
  }

  const payload = { ...validated.data, updatedAt: new Date().toISOString() };

  const { error } = await client.from("cms_content").upsert(
    {
      id: CMS_ROW_ID,
      data: payload,
      updated_at: payload.updatedAt,
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}

export async function seedCmsIfEmpty(): Promise<void> {
  const client = getAdminClient();
  if (!client) return;

  const { data: row } = await client
    .from("cms_content")
    .select("id")
    .eq("id", CMS_ROW_ID)
    .maybeSingle();

  if (row) return;

  const defaults = getDefaultCms();
  await writeCmsToSupabase(defaults);
}
