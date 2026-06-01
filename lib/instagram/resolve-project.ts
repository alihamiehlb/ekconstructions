import type { Project } from "@/content/projects";
import { mergeProjectSlides } from "@/lib/gallery-slides";
import {
  isInstagramCdnImageUrl,
  isInstagramPostUrl,
  resolveGalleryImageSource,
} from "@/lib/instagram/resolve-image";
import { mirrorRemoteImageToStorage } from "@/lib/media/mirror-to-storage";

export type ResolveProjectMediaResult = {
  project: Project;
  resolvedFromInstagram: number;
  mirroredToStorage: number;
};

async function persistGalleryImageUrl(url: string): Promise<{
  url: string;
  resolvedFromInstagram: boolean;
  mirroredToStorage: boolean;
}> {
  const trimmed = url.trim();
  if (!trimmed) return { url: "", resolvedFromInstagram: false, mirroredToStorage: false };

  const wasPost = isInstagramPostUrl(trimmed);
  const resolved = await resolveGalleryImageSource(trimmed);
  if (!resolved) {
    return { url: "", resolvedFromInstagram: false, mirroredToStorage: false };
  }

  const resolvedFromInstagram = wasPost && resolved !== trimmed;

  if (!isInstagramCdnImageUrl(resolved)) {
    return { url: resolved, resolvedFromInstagram, mirroredToStorage: false };
  }

  const stored = await mirrorRemoteImageToStorage(resolved);
  return {
    url: stored,
    resolvedFromInstagram,
    mirroredToStorage: stored !== resolved,
  };
}

/** Resolve Instagram URLs and mirror ephemeral CDN links to Supabase for cover + slides. */
export async function resolveProjectMedia(project: Project): Promise<ResolveProjectMediaResult> {
  let resolvedFromInstagram = 0;
  let mirroredToStorage = 0;

  const coverResult = await persistGalleryImageUrl(project.src);
  if (coverResult.resolvedFromInstagram) resolvedFromInstagram += 1;
  if (coverResult.mirroredToStorage) mirroredToStorage += 1;

  const src = coverResult.url;
  const extraInputs =
    project.images && project.images.length > 0 && project.images[0] === project.src.trim()
      ? project.images.slice(1)
      : (project.images ?? []).filter((url) => url.trim() !== project.src.trim());

  const resolvedExtras: string[] = [];
  for (const raw of extraInputs) {
    const result = await persistGalleryImageUrl(raw);
    if (result.resolvedFromInstagram) resolvedFromInstagram += 1;
    if (result.mirroredToStorage) mirroredToStorage += 1;
    if (result.url) resolvedExtras.push(result.url);
  }

  const images = mergeProjectSlides(src, resolvedExtras);

  return {
    project: { ...project, src, images },
    resolvedFromInstagram,
    mirroredToStorage,
  };
}

export async function resolveAllProjectMedia(
  projects: Project[],
): Promise<{ projects: Project[]; instagramResolved: number; mirroredToStorage: number }> {
  let instagramResolved = 0;
  let mirroredToStorage = 0;
  const resolved: Project[] = [];

  for (const project of projects) {
    const result = await resolveProjectMedia(project);
    instagramResolved += result.resolvedFromInstagram;
    mirroredToStorage += result.mirroredToStorage;
    resolved.push(result.project);
  }

  return { projects: resolved, instagramResolved, mirroredToStorage };
}
