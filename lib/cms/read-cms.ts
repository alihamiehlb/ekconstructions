import { getDefaultCms } from "@/lib/cms/defaults";
import { parseStoredCms } from "@/lib/cms/parse-stored-cms";
import {
  isSupabaseCmsConfigured,
  readCmsFromSupabase,
} from "@/lib/cms/supabase-cms";
import type { CmsData } from "@/lib/cms/types";
import { isMissingSchemaError } from "@/lib/supabase/errors";
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

/** Uncached CMS read — used by cache layer and writes. */
export async function readCmsUncached(): Promise<CmsData> {
  if (isSupabaseCmsConfigured()) {
    try {
      const fromDb = await readCmsFromSupabase();
      if (fromDb) return fromDb;
    } catch (e) {
      if (isMissingSchemaError(e)) {
        console.error("readCms: cms_content table missing — using defaults");
        return getDefaultCms();
      }
      console.error("readCms supabase:", e);
    }
  }

  if (process.env.VERCEL) {
    return getDefaultCms();
  }

  return readCmsFromFile();
}
