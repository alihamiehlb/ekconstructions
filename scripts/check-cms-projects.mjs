import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const client = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await client
  .from("cms_content")
  .select("data, updated_at")
  .eq("id", "main")
  .maybeSingle();

if (error) {
  console.error(error);
  process.exit(1);
}

const projects = data?.data?.projects ?? [];
console.log("updated_at:", data?.updated_at);
console.log("raw projects in DB:", projects.length);

const cats = {};
for (const p of projects) {
  cats[p.category] = (cats[p.category] || 0) + 1;
}
console.log("categories:", JSON.stringify(cats, null, 2));

if (projects[0]) {
  console.log("sample title:", projects[0].title);
  console.log("sample src:", projects[0].src?.slice(0, 80));
}
