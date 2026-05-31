import type { Project } from "@/content/projects";

const UNRELIABLE_HOST_PATTERNS = [
  /instagram\.[^/]+/i,
  /cdninstagram\.com/i,
  /fbcdn\.net/i,
];

export function isUnreliableImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return true;
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      return UNRELIABLE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
    }
  } catch {
    return true;
  }
  return false;
}

export function isValidGalleryImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/images/")) return true;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return !isUnreliableImageSrc(trimmed);
  }
  return false;
}

export function resolveGalleryImageSrc(src: string): string {
  const trimmed = src.trim();
  if (isValidGalleryImageSrc(trimmed)) return trimmed;
  return "";
}

export function normalizeProjectImages(project: Project): Project {
  const src = resolveGalleryImageSrc(project.src);
  const extras = (project.images ?? [])
    .map((image) => resolveGalleryImageSrc(image))
    .filter((image) => image && image !== src);
  const uniqueExtras = [...new Set(extras)];
  const images =
    src && uniqueExtras.length > 0
      ? [src, ...uniqueExtras]
      : !src && uniqueExtras.length > 0
        ? uniqueExtras
        : undefined;

  return { ...project, src, images };
}

export function normalizeProjectList(projects: Project[]): Project[] {
  return projects.map(normalizeProjectImages);
}
