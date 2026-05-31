import { resolveGalleryImageSrc } from "@/lib/gallery-image";
import type { Project } from "@/content/projects";

/** All display images for a project (carousel uses full list; cover uses first). */
export function getProjectImages(project: Project): string[] {
  const resolved = (project.images ?? [project.src]).map((src) =>
    resolveGalleryImageSrc(src, project.id),
  );
  const unique = [...new Set(resolved)];
  return unique.length > 0 ? unique : [resolveGalleryImageSrc(project.src, project.id)];
}

export function projectHasGallery(project: Project): boolean {
  return getProjectImages(project).length > 1;
}
