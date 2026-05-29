import { projects as defaultProjects, type Project } from "@/content/projects";
import { getCmsProjects } from "@/lib/cms";
import fs from "fs";
import path from "path";

export type { Project };

const INSTAGRAM_DIR = path.join(process.cwd(), "public", "instagram");

function applyInstagramOverrides(projects: Project[]): Project[] {
  if (!fs.existsSync(INSTAGRAM_DIR)) return projects;

  const files = fs
    .readdirSync(INSTAGRAM_DIR)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .slice(0, projects.length);

  if (files.length < projects.length) return projects;

  return projects.map((project, i) => ({
    ...project,
    src: `/instagram/${files[i]}`,
  }));
}

export async function getProjects(): Promise<Project[]> {
  const cmsProjects = await getCmsProjects();
  const base = cmsProjects.length ? cmsProjects : defaultProjects;
  return applyInstagramOverrides(base);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}
