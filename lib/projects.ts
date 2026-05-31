import type { Project } from "@/content/projects";
import { getCmsProjects } from "@/lib/cms";
import { filterPublicGalleryProjects } from "@/lib/cms/purge-legacy-projects";

export type { Project };

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const orderA = a.sortOrder ?? 999;
    const orderB = b.sortOrder ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

/** Public gallery — CMS projects only (no hardcoded fallbacks). */
export async function getProjects(): Promise<Project[]> {
  const cmsProjects = filterPublicGalleryProjects(await getCmsProjects());
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

/** All CMS projects including drafts — admin preview only. */
export async function getAdminProjects(): Promise<Project[]> {
  return sortProjects(await getCmsProjects());
}

export async function getAdminProjectById(id: string): Promise<Project | undefined> {
  const list = await getAdminProjects();
  return list.find((p) => p.id === id);
}
