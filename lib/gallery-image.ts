import type { Project } from "@/content/projects";
import { isInstagramPostUrl } from "@/lib/instagram/resolve-image";

/** Instagram post/reel pages — not image files; resolved to CDN URLs on save. */
export { isInstagramPostUrl };

/** Site stock assets — never valid gallery project photos. */
const STOCK_IMAGE_PATH_PATTERNS = [
  /^\/images\/hero-/i,
  /^\/images\/before-after-/i,
  /^\/images\/project-/i,
  /^\/images\/gallery\//i,
  /^\/images\/icon-/i,
  /^\/images\/ek-logo/i,
  /^\/images\/placeholder/i,
];

export function isUnreliableImageSrc(src: string): boolean {
  return isInstagramPostUrl(src);
}

export function isStockGalleryImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed.startsWith("/images/")) return false;
  return STOCK_IMAGE_PATH_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/** Direct image URL suitable for <img> / Next Image (not an Instagram post page). */
export function isValidGalleryImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (isStockGalleryImageSrc(trimmed)) return false;
  if (isInstagramPostUrl(trimmed)) return false;
  if (trimmed.startsWith("/images/")) return true;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return true;
  return false;
}

/** Allowed in admin before save — includes Instagram post links (resolved on save). */
export function isAcceptableGalleryImageInput(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  return isValidGalleryImageSrc(trimmed) || isInstagramPostUrl(trimmed);
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
