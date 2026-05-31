import type { Project } from "@/content/projects";

/** Shown when a remote URL fails or an expired CDN link is detected. */
export const GALLERY_FALLBACK_SRC = "/images/gallery/placeholder.jpg";

const PLACEHOLDER_SRCS = new Set<string>([GALLERY_FALLBACK_SRC]);

const LEGACY_GALLERY_BY_ID: Record<string, string> = {
  "project-DXJsOgwDysY": "/images/gallery/glass-balustrade-pool.jpg",
  "project-DW3rM9qmE-K": "/images/gallery/aluminium-windows.jpg",
};

const UNRELIABLE_HOST_PATTERNS = [
  /instagram\.[^/]+/i,
  /cdninstagram\.com/i,
  /fbcdn\.net/i,
];

export function isUnreliableImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_SRCS.has(trimmed)) return true;
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

export function isPlaceholderImageSrc(src: string): boolean {
  return PLACEHOLDER_SRCS.has(src.trim());
}

export function isValidGalleryImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed || isPlaceholderImageSrc(trimmed)) return false;
  if (trimmed.startsWith("/images/")) return true;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return !isUnreliableImageSrc(trimmed);
  }
  return false;
}

export function resolveGalleryImageSrc(src: string, projectId?: string): string {
  const trimmed = src.trim();
  if (isValidGalleryImageSrc(trimmed)) return trimmed;
  if (projectId && LEGACY_GALLERY_BY_ID[projectId]) return LEGACY_GALLERY_BY_ID[projectId];
  return GALLERY_FALLBACK_SRC;
}

export function normalizeProjectImages(project: Project): Project {
  const src = resolveGalleryImageSrc(project.src, project.id);
  const images = project.images
    ?.map((image) => resolveGalleryImageSrc(image, project.id))
    .filter((image, index, list) => list.indexOf(image) === index);

  const normalizedImages =
    images && images.length > 0
      ? images[0] === src
        ? images
        : [src, ...images.filter((image) => image !== src)]
      : undefined;

  return {
    ...project,
    src,
    images: normalizedImages,
  };
}

export function normalizeProjectList(projects: Project[]): Project[] {
  return projects.map(normalizeProjectImages);
}
