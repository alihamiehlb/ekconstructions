import type { z } from "zod";
import type { cmsSchema } from "@/lib/cms/schema";
import {
  sanitizeAssetPath,
  sanitizeEmail,
  sanitizeText,
} from "@/lib/security/sanitize";

type CmsPayload = z.infer<typeof cmsSchema>;

export function sanitizeCmsPayload(data: CmsPayload): CmsPayload {
  return {
    ...data,
    site: {
      ...data.site,
      name: sanitizeText(data.site.name, 120),
      tagline: sanitizeText(data.site.tagline, 300),
      headline: sanitizeText(data.site.headline, 200),
      headlineAccent: sanitizeText(data.site.headlineAccent, 200),
      contactEmail: sanitizeEmail(data.site.contactEmail),
      contactPhone: sanitizeText(data.site.contactPhone, 30),
      projectsDelivered: sanitizeText(data.site.projectsDelivered, 20),
      abn: sanitizeText(data.site.abn, 20),
      instagramHandle: sanitizeText(data.site.instagramHandle, 60),
      instagramUrl: sanitizeText(data.site.instagramUrl, 300),
      locationArea: sanitizeText(data.site.locationArea, 120),
      aboutParagraphs: data.site.aboutParagraphs.map((p) => sanitizeText(p, 2000)),
    },
    services: data.services.map((s) => ({
      id: sanitizeText(s.id, 40),
      title: sanitizeText(s.title, 120),
      description: sanitizeText(s.description, 500),
      icon: sanitizeText(s.icon, 40),
    })),
    whyChooseUs: data.whyChooseUs.map((w) => ({
      title: sanitizeText(w.title, 120),
      description: sanitizeText(w.description, 500),
      icon: sanitizeText(w.icon, 40),
    })),
    materials: data.materials.map((m) => sanitizeText(m, 200)).filter(Boolean),
    projects: data.projects.map((p) => ({
      ...p,
      id: sanitizeText(p.id, 40),
      title: sanitizeText(p.title, 120),
      category: sanitizeText(p.category, 80),
      src: sanitizeRemoteOrAssetPath(p.src),
      images: p.images
        ?.map((img) => sanitizeRemoteOrAssetPath(img))
        .filter(Boolean),
      alt: sanitizeText(p.alt, 200),
      description: sanitizeText(p.description, 2000),
      objectPosition: p.objectPosition ? sanitizeText(p.objectPosition, 80) : undefined,
      instagramUrl: p.instagramUrl ? sanitizeText(p.instagramUrl, 300) : undefined,
      highlights: p.highlights?.map((h) => sanitizeText(h, 120)),
    })),
  };
}

function sanitizeRemoteOrAssetPath(value: string): string {
  const text = sanitizeText(value, 500);
  if (text.startsWith("https://") || text.startsWith("http://")) return text;
  return sanitizeAssetPath(text) ?? text;
}
