import { siteConfig } from "@/content/site";
import { getProjects } from "@/lib/projects";
import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticPages = [
    "",
    "/gallery",
    "/privacy",
    "/terms",
    "/cookies",
    "/security",
    "/disclaimer",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/gallery" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/gallery" ? 0.9 : 0.5,
    })),
    ...projects.map((p) => ({
      url: `${base}/gallery/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
