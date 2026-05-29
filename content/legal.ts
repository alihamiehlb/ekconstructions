import { siteConfig } from "@/content/site";

export const legalUpdated = "29 May 2026";

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/security", label: "Security" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export const businessLegal = {
  name: siteConfig.name,
  abn: siteConfig.business.abn,
  email: siteConfig.contact.email,
  jurisdiction: "New South Wales, Australia",
  siteUrl: siteConfig.url,
};
