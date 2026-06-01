import type { Project } from "@/content/projects";
import { resolveGalleryImageSource } from "@/lib/instagram/resolve-image";

export type ResolveProjectMediaResult = {
  project: Project;
  resolvedFromInstagram: string[];
};

/** Resolve Instagram post URLs in cover + slides to CDN image URLs. */
export async function resolveProjectMedia(project: Project): Promise<ResolveProjectMediaResult> {
  const resolvedFromInstagram: string[] = [];

  let src = project.src.trim();
  if (src) {
    const next = await resolveGalleryImageSource(src);
    if (next && next !== src) resolvedFromInstagram.push("cover");
    src = next;
  }

  const extras: string[] = [];
  for (const raw of project.images ?? []) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const next = await resolveGalleryImageSource(trimmed);
    if (next && next !== trimmed) resolvedFromInstagram.push("slide");
    if (next) extras.push(next);
  }

  const uniqueExtras = [...new Set(extras.filter((url) => url && url !== src))];

  const images =
    src && uniqueExtras.length > 0
      ? [src, ...uniqueExtras]
      : !src && uniqueExtras.length > 0
        ? uniqueExtras
        : undefined;

  return {
    project: { ...project, src, images },
    resolvedFromInstagram,
  };
}

export async function resolveAllProjectMedia(
  projects: Project[],
): Promise<{ projects: Project[]; instagramResolved: number }> {
  let instagramResolved = 0;
  const resolved: Project[] = [];

  for (const project of projects) {
    const result = await resolveProjectMedia(project);
    if (result.resolvedFromInstagram.length > 0) instagramResolved += 1;
    resolved.push(result.project);
  }

  return { projects: resolved, instagramResolved };
}
