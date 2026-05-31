import type { Project } from "@/content/projects";
import { isStockGalleryImageSrc, isValidGalleryImageSrc, normalizeProjectList } from "@/lib/gallery-image";

/** Baked-in demo projects from early site builds — hidden on the public site only. */
export const LEGACY_DEMO_PROJECT_IDS = new Set([
  "project-DXJsOgwDysY",
  "project-DW3rM9qmE-K",
  "project-privacy-screen-01",
  "project-steel-structure-01",
  "project-carpentry-01",
]);

/** True when the project id or cover image is a known demo placeholder. */
export function isLegacyDemoProject(project: Project): boolean {
  if (LEGACY_DEMO_PROJECT_IDS.has(project.id)) return true;

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
