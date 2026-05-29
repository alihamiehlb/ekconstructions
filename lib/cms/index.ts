import { getDefaultCms } from "@/lib/cms/defaults";
import type { CmsData } from "@/lib/cms/types";
import { promises as fs } from "fs";
import path from "path";

const CMS_PATH = path.join(process.cwd(), "data", "cms.json");

export async function readCms(): Promise<CmsData> {
  const defaults = getDefaultCms();
  try {
    const raw = await fs.readFile(CMS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CmsData>;
    return {
      ...defaults,
      ...parsed,
      site: { ...defaults.site, ...parsed.site },
      services: parsed.services?.length ? parsed.services : defaults.services,
      whyChooseUs: parsed.whyChooseUs?.length ? parsed.whyChooseUs : defaults.whyChooseUs,
      materials: parsed.materials?.length ? parsed.materials : defaults.materials,
      projects: parsed.projects?.length ? parsed.projects : defaults.projects,
    };
  } catch {
    return defaults;
  }
}

export async function writeCms(data: CmsData): Promise<void> {
  await fs.mkdir(path.dirname(CMS_PATH), { recursive: true });
  await fs.writeFile(
    CMS_PATH,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
    "utf-8",
  );
}

export async function getCmsProjects() {
  const cms = await readCms();
  return cms.projects;
}

export { buildSiteContext } from "@/lib/cms/public-site";
