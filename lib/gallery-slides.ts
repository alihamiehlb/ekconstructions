import type { Project } from "@/content/projects";

/** Split pasted or typed text into multiple image URLs (newline, comma, or semicolon). */
export function parseSlideUrlLines(text: string): string[] {
  const parts = text.split(/\r?\n|[,;]+/).map((line) => line.trim()).filter(Boolean);
  return [...new Set(parts)];
}

/** Extra carousel URLs only (excludes cover). */
export function getProjectExtraSlides(project: Project): string[] {
  const cover = project.src.trim();
  const images = (project.images ?? []).map((url) => url.trim()).filter(Boolean);
  if (images.length === 0) return [];
  if (images[0] === cover) return images.slice(1);
  return images.filter((url) => url !== cover);
}

/** Build stored images array: cover first, then unique extra slides. */
export function mergeProjectSlides(coverSrc: string, extraSlides: string[]): string[] | undefined {
  const cover = coverSrc.trim();
  const extras = [...new Set(extraSlides.map((url) => url.trim()).filter(Boolean))].filter(
    (url) => url !== cover,
  );
  if (!cover) return extras.length ? extras : undefined;
  if (extras.length === 0) return undefined;
  return [cover, ...extras];
}
