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

export type CmsBeforeAfterSection = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type CmsBeforeAfterItem = {
  id: string;
  title: string;
  location: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

export type SiteContent = {
  name: string;
  tagline: string;
  headline: string;
  headlineAccent: string;
  contactEmail: string;
  contactPhone: string;
  projectsDelivered: string;
  yearsExperience: string;
  memberSince: string;
  abn: string;
  instagramHandle: string;
  instagramUrl: string;
  locationArea: string;
  suburb: string;
  aboutParagraphs: string[];
};

export type CmsData = {
  site: SiteContent;
  services: CmsService[];
  whyChooseUs: CmsWhyItem[];
  materials: string[];
  projects: Project[];
  beforeAfterSection: CmsBeforeAfterSection;
  beforeAfterItems: CmsBeforeAfterItem[];
  updatedAt: string;
};
