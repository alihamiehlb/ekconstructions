/**
 * Import gallery from extracted zip folders → WebP on Supabase → CMS projects.
 *
 * Prereq: extract ekcontruct-images.zip to .tmp-gallery-import/ekconstructions/
 * Run: node scripts/import-gallery-zip.mjs
 * Dry run: node scripts/import-gallery-zip.mjs --dry-run
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(ROOT, "..");
const IMPORT_ROOT = path.join(PROJECT_ROOT, ".tmp-gallery-import", "ekconstructions");
const CMS_ROW_ID = "main";
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 3;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

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
  loadEnvFile(path.join(PROJECT_ROOT, file));
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function inferCategory(text) {
  const t = text.toLowerCase();
  if (/\b(glass|balustrade|awning|frameless)\b|#glass/.test(t)) return "Glass Balustrade";
  if (/\b(aluminium|aluminum|window)\b|#aluminium/.test(t)) return "Aluminium Windows";
  if (/\b(privacy|screen)\b|#privacy/.test(t)) return "Privacy Screens";
  if (/\b(steel|wrought|metal)\b|#steel/.test(t)) return "Steel Work";
  return "Recent Work";
}

function parseCaption(txtContent, fallbackTitle) {
  const firstLine = (txtContent.split("\n")[0] ?? "").trim();
  const title =
    firstLine
      .replace(/#\w+/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120) || fallbackTitle;
  const description = (firstLine || title).slice(0, 2000);
  return { title, description };
}

function folderDateKey(folderName) {
  const m = folderName.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : folderName;
}

function projectIdFromFolder(folderName, index) {
  const base = folderName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "");
  return `import-${base || index}`;
}

async function processToWebp(filePath) {
  const input = readFileSync(filePath);
  if (input.length > 5 * 1024 * 1024) throw new Error(`File too large: ${filePath}`);
  return sharp(input)
    .rotate()
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

async function uploadWebp(client, buffer, prefix) {
  const objectPath = `gallery/import-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`;
  const { error } = await client.storage.from("media").upload(objectPath, buffer, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) throw error;
  const { data } = client.storage.from("media").getPublicUrl(objectPath);
  return data.publicUrl;
}

async function mapPool(items, limit, fn) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function listImageFiles(dir) {
  return readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function readTxtForImage(dir, imageFile) {
  const txtPath = path.join(dir, `${imageFile}.txt`);
  if (existsSync(txtPath)) return readFileSync(txtPath, "utf8");
  const base = path.parse(imageFile).name;
  const alt = path.join(dir, `${base}.jpg.txt`);
  if (existsSync(alt)) return readFileSync(alt, "utf8");
  return "";
}

async function buildProjects(client) {
  if (!existsSync(IMPORT_ROOT)) {
    throw new Error(`Missing ${IMPORT_ROOT} — extract the zip first.`);
  }

  const folders = readdirSync(IMPORT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => folderDateKey(b).localeCompare(folderDateKey(a)));

  console.log(`Found ${folders.length} post folders.`);

  const projects = [];
  let sortOrder = 1;

  for (const folderName of folders) {
    const dir = path.join(IMPORT_ROOT, folderName);
    const images = listImageFiles(dir);
    if (images.length === 0) {
      console.warn(`Skip ${folderName}: no images`);
      continue;
    }

    const coverTxt = readTxtForImage(dir, images[0]);
    const { title, description } = parseCaption(coverTxt, folderName.replace(/_/g, " "));
    const category = inferCategory(coverTxt || title);

    const uploadTasks = images.map((file) => ({
      file,
      filePath: path.join(dir, file),
    }));

    let urls;
    if (DRY_RUN) {
      urls = uploadTasks.map((t) => `dry-run://${folderName}/${t.file}`);
    } else {
      urls = await mapPool(uploadTasks, CONCURRENCY, async ({ filePath }) => {
        const webp = await processToWebp(filePath);
        return uploadWebp(client, webp, folderName);
      });
    }

    const [src, ...rest] = urls;
    const alt = title.slice(0, 200);

    projects.push({
      id: projectIdFromFolder(folderName, projects.length),
      title,
      category,
      src,
      images: rest.length > 0 ? rest : undefined,
      alt,
      description,
      sortOrder: sortOrder++,
      featured: false,
    });
  }

  const featuredCount = 3;
  for (let i = 0; i < Math.min(featuredCount, projects.length); i++) {
    projects[i].featured = true;
  }

  return projects;
}

async function loadCmsRow(client) {
  const { data: row, error } = await client
    .from("cms_content")
    .select("data")
    .eq("id", CMS_ROW_ID)
    .maybeSingle();
  if (error) throw error;
  return row?.data ?? null;
}

async function main() {
  if (!supabaseUrl || !serviceKey) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const projects = await buildProjects(client);

  console.log(`Built ${projects.length} projects${DRY_RUN ? " (dry run)" : ""}.`);

  if (DRY_RUN) {
    console.log("Sample:", projects[0]?.title, projects[0]?.src?.slice(0, 60));
    return;
  }

  const existing = await loadCmsRow(client);
  if (!existing) {
    console.error("No CMS row — seed CMS in admin first, then re-run import.");
    process.exit(1);
  }

  const updatedAt = new Date().toISOString();
  const payload = {
    ...existing,
    projects,
    updatedAt,
  };

  const { error: writeError } = await client.from("cms_content").upsert({
    id: CMS_ROW_ID,
    data: payload,
    updated_at: updatedAt,
  });

  if (writeError) throw writeError;
  console.log(`Wrote ${projects.length} projects to Supabase CMS. Redeploy or wait ~60s for ISR cache.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
