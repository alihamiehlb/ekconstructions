/**
 * Clears all gallery projects from CMS (Supabase or local file).
 * Run: node scripts/clear-cms-projects.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";

function loadEnvFile(filePath) {
  try {
    let raw = readFileSync(filePath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const body = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
      const eq = body.indexOf("=");
      if (eq < 1) continue;
      const key = body.slice(0, eq).trim();
      let val = body.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      const existing = process.env[key];
      if (!existing || existing.length === 0) process.env[key] = val;
    }
  } catch {
    /* skip */
  }
}

for (const file of [".env.local", ".env"]) {
  loadEnvFile(path.join(process.cwd(), file));
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
