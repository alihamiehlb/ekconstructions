import type { Project } from "@/content/projects";

/** All display images for a project (carousel uses full list; cover uses first). */
export function getProjectImages(project: Project): string[] {
  if (project.images?.length) return project.images;
  return [project.src];
}

export function projectHasGallery(project: Project): boolean {
  return getProjectImages(project).length > 1;
}
