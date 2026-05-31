import { getDefaultCms } from "@/lib/cms/defaults";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import { purgeLegacyGalleryProjects } from "@/lib/cms/purge-legacy-projects";
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

  const parsed = cmsSchema.safeParse(row.data);
  if (!parsed.success) return getDefaultCms();

  const merged = mergeCmsWithDefaults({
    ...parsed.data,
    updatedAt: row.updated_at ?? undefined,
  });

  const purged = purgeLegacyGalleryProjects(merged.projects);
  if (purged.length !== merged.projects.length) {
    const cleaned = { ...merged, projects: purged, updatedAt: new Date().toISOString() };
    try {
      await writeCmsToSupabase(cleaned);
    } catch (e) {
      console.error("purge legacy gallery projects:", e);
    }
    return cleaned;
  }

  return merged;
}

export async function writeCmsToSupabase(data: CmsData): Promise<void> {
  const client = getAdminClient();
  if (!client) throw new Error("Supabase not configured");

  const payload = { ...data, updatedAt: new Date().toISOString() };

  const { error } = await client.from("cms_content").upsert({
    id: CMS_ROW_ID,
    data: payload,
    updated_at: payload.updatedAt,
  });

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
