import type { Project } from "@/content/projects";

export type CmsService = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type CmsWhyItem = {
  title: string;
  description: string;
  icon: string;
};

export type SiteContent = {
  name: string;
  tagline: string;
  headline: string;
  headlineAccent: string;
  contactEmail: string;
  contactPhone: string;
  projectsDelivered: string;
  abn: string;
  instagramHandle: string;
  instagramUrl: string;
  locationArea: string;
  aboutParagraphs: string[];
};

export type CmsData = {
  site: SiteContent;
  services: CmsService[];
  whyChooseUs: CmsWhyItem[];
  materials: string[];
  projects: Project[];
  updatedAt: string;
};
