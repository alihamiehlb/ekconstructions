import { CMS_CACHE_TAG, readCms } from "@/lib/cms/cache";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import { readCmsUncached } from "@/lib/cms/read-cms";
import {
  isSupabaseCmsConfigured,
  seedCmsIfEmpty,
  writeCmsToSupabase,
} from "@/lib/cms/supabase-cms";
import type { CmsData } from "@/lib/cms/types";
import { cmsSchema } from "@/lib/cms/schema";
import { revalidateTag } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

const CMS_PATH = path.join(process.cwd(), "data", "cms.json");

export { readCms };

async function writeCmsToFile(data: CmsData): Promise<void> {
  await fs.mkdir(path.dirname(CMS_PATH), { recursive: true });
  await fs.writeFile(
    CMS_PATH,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
    "utf-8",
  );
}

export async function writeCms(data: CmsData): Promise<void> {
  const validated = cmsSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(`CMS validation failed: ${JSON.stringify(validated.error.flatten())}`);
  }

  const merged = mergeCmsWithDefaults(validated.data);

  if (isSupabaseCmsConfigured()) {
    await seedCmsIfEmpty();
    await writeCmsToSupabase(merged);
    revalidateTag(CMS_CACHE_TAG);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Gallery cannot be saved: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.",
    );
  }

  await writeCmsToFile(merged);
  revalidateTag(CMS_CACHE_TAG);
}

export async function getCmsProjects() {
  const cms = await readCms();
  return cms.projects;
}

export { buildSiteContext } from "@/lib/cms/public-site";
