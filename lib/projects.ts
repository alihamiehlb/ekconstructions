import type { Project } from "@/content/projects";
import { getCmsProjects } from "@/lib/cms";
import { purgeLegacyGalleryProjects } from "@/lib/cms/purge-legacy-projects";
import {
  isValidGalleryImageSrc,
  normalizeProjectList,
} from "@/lib/gallery-image";

export type { Project };

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const orderA = a.sortOrder ?? 999;
    const orderB = b.sortOrder ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

function isValidProject(project: Project): boolean {
  return Boolean(project.title?.trim()) && Boolean(project.src?.trim()) && isValidGalleryImageSrc(project.src);
}

/** Public gallery — CMS projects only (no hardcoded fallbacks). */
export async function getProjects(): Promise<Project[]> {
  const cmsProjects = purgeLegacyGalleryProjects(
    normalizeProjectList(await getCmsProjects()),
  ).filter(isValidProject);
  return sortProjects(cmsProjects);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.id === id);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  if (featured.length > 0) return featured.slice(0, limit);
  return projects.slice(0, limit);
}
