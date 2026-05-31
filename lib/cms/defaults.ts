import {
  aboutParagraphs,
  materials,
  services,
  siteConfig,
  whyChooseUs,
} from "@/content/site";
import type { CmsData } from "@/lib/cms/types";

export function getDefaultCms(): CmsData {
  return {
    site: {
      name: siteConfig.name,
      tagline: siteConfig.tagline,
      headline: siteConfig.headline,
      headlineAccent: siteConfig.headlineAccent,
      contactEmail: siteConfig.contact.email,
      contactPhone: siteConfig.contact.phone,
      projectsDelivered: siteConfig.business.projectsDelivered,
      yearsExperience: siteConfig.business.yearsExperience,
      memberSince: String(siteConfig.business.memberSince),
      abn: siteConfig.business.abn,
      instagramHandle: siteConfig.instagram.handle,
      instagramUrl: siteConfig.instagram.url,
      locationArea: siteConfig.location.area,
      suburb: siteConfig.location.suburb,
      aboutParagraphs: [...aboutParagraphs],
    },
    services: services.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
    })),
    whyChooseUs: whyChooseUs.map((w) => ({
      title: w.title,
      description: w.description,
      icon: w.icon,
    })),
    materials: [...materials],
    projects: [],
    updatedAt: new Date().toISOString(),
  };
}
