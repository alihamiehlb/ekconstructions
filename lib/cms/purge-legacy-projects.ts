import type { Project } from "@/content/projects";
import { isStockGalleryImageSrc, isValidGalleryImageSrc } from "@/lib/gallery-image";

/** Baked-in demo projects from early site builds — never show publicly. */
export const LEGACY_DEMO_PROJECT_IDS = new Set([
  "project-DXJsOgwDysY",
  "project-DW3rM9qmE-K",
  "project-privacy-screen-01",
  "project-steel-structure-01",
  "project-carpentry-01",
]);

export function isLegacyDemoProject(project: Project): boolean {
  if (LEGACY_DEMO_PROJECT_IDS.has(project.id)) return true;

  const src = project.src.trim();
  if (src.startsWith("/images/gallery/")) return true;

  if (isStockGalleryImageSrc(src)) return true;

  const extras = project.images ?? [];
  if (extras.some((image) => image.startsWith("/images/gallery/") || isStockGalleryImageSrc(image))) {
    return true;
  }

  return false;
}

export function purgeLegacyGalleryProjects(projects: Project[]): Project[] {
  return projects.filter(
    (project) => !isLegacyDemoProject(project) && isValidGalleryImageSrc(project.src.trim()),
  );
}
