import type { Project } from "@/content/projects";
import { isStockGalleryImageSrc, isValidGalleryImageSrc, normalizeProjectList } from "@/lib/gallery-image";

/** True when the project still uses baked-in demo placeholder assets. */
export function isLegacyDemoProject(project: Project): boolean {
  const src = project.src.trim();
  if (src.startsWith("/images/gallery/")) return true;
  return isStockGalleryImageSrc(src);
}

function isValidPublicProject(project: Project): boolean {
  return (
    Boolean(project.title?.trim()) &&
    Boolean(project.src?.trim()) &&
    isValidGalleryImageSrc(project.src)
  );
}

/** Filters demo/invalid projects for the public gallery — never mutates CMS storage. */
export function filterPublicGalleryProjects(projects: Project[]): Project[] {
  return normalizeProjectList(projects).filter(
    (project) => !isLegacyDemoProject(project) && isValidPublicProject(project),
  );
}

/** @deprecated Use filterPublicGalleryProjects — kept for any stale imports. */
export const purgeLegacyGalleryProjects = filterPublicGalleryProjects;
