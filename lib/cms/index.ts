import { getDefaultCms } from "@/lib/cms/defaults";
import { parseStoredCms } from "@/lib/cms/parse-stored-cms";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import {
  isSupabaseCmsConfigured,
  readCmsFromSupabase,
  seedCmsIfEmpty,
  writeCmsToSupabase,
} from "@/lib/cms/supabase-cms";
import type { CmsData } from "@/lib/cms/types";
import { cmsSchema } from "@/lib/cms/schema";
import { promises as fs } from "fs";
import path from "path";

const CMS_PATH = path.join(process.cwd(), "data", "cms.json");

async function readCmsFromFile(): Promise<CmsData> {
  try {
    const raw = await fs.readFile(CMS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    return parseStoredCms(parsed);
  } catch {
    return getDefaultCms();
  }
}

async function writeCmsToFile(data: CmsData): Promise<void> {
  await fs.mkdir(path.dirname(CMS_PATH), { recursive: true });
  await fs.writeFile(
    CMS_PATH,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
    "utf-8",
  );
}

export async function readCms(): Promise<CmsData> {
  if (isSupabaseCmsConfigured()) {
    try {
      await seedCmsIfEmpty();
      const fromDb = await readCmsFromSupabase();
      if (fromDb) return fromDb;
    } catch (e) {
      console.error("readCms supabase:", e);
    }
  }

  if (process.env.VERCEL) {
    return getDefaultCms();
  }

  return readCmsFromFile();
}

export async function writeCms(data: CmsData): Promise<void> {
  const validated = cmsSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(`CMS validation failed: ${JSON.stringify(validated.error.flatten())}`);
  }

  const merged = mergeCmsWithDefaults(validated.data);

  if (isSupabaseCmsConfigured()) {
    await writeCmsToSupabase(merged);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Gallery cannot be saved: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.",
    );
  }

  await writeCmsToFile(merged);
}

export async function getCmsProjects() {
  const cms = await readCms();
  return cms.projects;
}

export { buildSiteContext } from "@/lib/cms/public-site";
