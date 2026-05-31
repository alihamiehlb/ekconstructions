import { getDefaultCms } from "@/lib/cms/defaults";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import {
  isSupabaseCmsConfigured,
  readCmsFromSupabase,
  seedCmsIfEmpty,
  writeCmsToSupabase,
} from "@/lib/cms/supabase-cms";
import type { CmsData } from "@/lib/cms/types";
import { promises as fs } from "fs";
import path from "path";

const CMS_PATH = path.join(process.cwd(), "data", "cms.json");

async function readCmsFromFile(): Promise<CmsData> {
  try {
    const raw = await fs.readFile(CMS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CmsData>;
    return mergeCmsWithDefaults(parsed);
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
  return readCmsFromFile();
}

export async function writeCms(data: CmsData): Promise<void> {
  if (isSupabaseCmsConfigured()) {
    await writeCmsToSupabase(data);
    return;
  }
  await writeCmsToFile(data);
}

export async function getCmsProjects() {
  const cms = await readCms();
  return cms.projects;
}

export { buildSiteContext } from "@/lib/cms/public-site";
