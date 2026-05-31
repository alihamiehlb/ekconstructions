import { projects as defaultProjects, type Project } from "@/content/projects";
import { getCmsProjects } from "@/lib/cms";

export type { Project };

const PLACEHOLDER_PREFIX = "/images/gallery/";

function isPlaceholderProject(project: Project): boolean {
  if (project.src.startsWith(PLACEHOLDER_PREFIX)) return true;
  return (project.images ?? []).some((src) => src.startsWith(PLACEHOLDER_PREFIX));
}

function isValidImageSrc(src: string): boolean {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    (src.startsWith("/") && !src.startsWith(PLACEHOLDER_PREFIX))
  );
}

function isValidProject(project: Project): boolean {
  return Boolean(project.src?.trim()) && isValidImageSrc(project.src) && !isPlaceholderProject(project);
}

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const orderA = a.sortOrder ?? 999;
    const orderB = b.sortOrder ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

export async function getProjects(): Promise<Project[]> {
  const cmsProjects = (await getCmsProjects()).filter(isValidProject);
  if (cmsProjects.length > 0) return sortProjects(cmsProjects);
  return sortProjects(defaultProjects.filter(isValidProject));
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
