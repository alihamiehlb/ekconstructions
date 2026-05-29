import type { CmsData, SiteContent } from "@/lib/cms/types";

export type PublicSiteConfig = {
  name: string;
  tagline: string;
  headline: string;
  headlineAccent: string;
  url: string;
  locale: "en-AU";
  instagram: { handle: string; url: string };
  location: { area: string; suburb: string; state: string; country: string };
  business: {
    abn: string;
    memberSince: number;
    yearsExperience: string;
    projectsDelivered: string;
  };
  contact: { email: string; phone: string };
};

export type SiteContextValue = PublicSiteConfig & {
  aboutParagraphs: string[];
};

export function buildSiteContext(cms: CmsData): SiteContextValue {
  const site = cms.site;
  return {
    name: site.name,
    tagline: site.tagline,
    headline: site.headline,
    headlineAccent: site.headlineAccent,
    url: "https://ekconstructions.com.au",
    locale: "en-AU",
    instagram: { handle: site.instagramHandle, url: site.instagramUrl },
    location: {
      area: site.locationArea,
      suburb: "North Ryde",
      state: "NSW",
      country: "Australia",
    },
    business: {
      abn: site.abn,
      memberSince: 1993,
      yearsExperience: "30+",
      projectsDelivered: site.projectsDelivered,
    },
    contact: { email: site.contactEmail, phone: site.contactPhone },
    aboutParagraphs: site.aboutParagraphs,
  };
}

export type { SiteContent };
