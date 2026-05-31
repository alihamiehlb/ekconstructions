/**
 * Clears all gallery projects from CMS (Supabase or local file).
 * Run: node scripts/clear-cms-projects.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";

for (const file of [".env.local", ".env"]) {
  try {
    const raw = readFileSync(file, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {
    /* skip */
  }
}

const CMS_ROW_ID = "main";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function clearSupabase() {
  if (!url || !key) return false;

  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data: row, error } = await client
    .from("cms_content")
    .select("data, updated_at")
    .eq("id", CMS_ROW_ID)
    .maybeSingle();

  if (error) throw error;
  if (!row?.data) {
    console.log("No CMS row in Supabase — nothing to clear.");
    return true;
  }

  const count = Array.isArray(row.data.projects) ? row.data.projects.length : 0;
  const updatedAt = new Date().toISOString();
  const payload = { ...row.data, projects: [], updatedAt };

  const { error: writeError } = await client.from("cms_content").upsert({
    id: CMS_ROW_ID,
    data: payload,
    updated_at: updatedAt,
  });

  if (writeError) throw writeError;
  console.log(`Cleared ${count} project(s) from Supabase CMS.`);
  return true;
}

function clearLocalFile() {
  const cmsPath = path.join(process.cwd(), "data", "cms.json");
  try {
    const raw = readFileSync(cmsPath, "utf8");
    const data = JSON.parse(raw);
    const count = Array.isArray(data.projects) ? data.projects.length : 0;
    data.projects = [];
    data.updatedAt = new Date().toISOString();
    mkdirSync(path.dirname(cmsPath), { recursive: true });
    writeFileSync(cmsPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Cleared ${count} project(s) from data/cms.json.`);
    return true;
  } catch {
    return false;
  }
}

const usedSupabase = await clearSupabase();
if (!usedSupabase) {
  const usedFile = clearLocalFile();
  if (!usedFile) console.log("No CMS source found — defaults already have zero projects.");
}
