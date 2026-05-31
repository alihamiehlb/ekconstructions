import { getCmsProjects } from "@/lib/cms";
import { readSecurityAudit } from "@/lib/security/audit";
import { getAdminStats, getStorageMode } from "@/lib/store";

export type AdminInsights = {
  gallery: {
    projectCount: number;
    featuredCount: number;
    carouselCount: number;
    totalSlides: number;
    categories: { name: string; count: number }[];
  };
  activity: {
    logEvents24h: number;
    cmsUpdates: number;
    failedLogins: number;
  };
  site: {
    storage: "supabase" | "file";
    enquiriesTotal: number;
    enquiriesWeek: number;
    pageViewsTotal: number;
    conversionRate: number;
    topServices: { service: string; count: number }[];
  };
};

export async function getAdminInsights(): Promise<AdminInsights> {
  const [projects, stats, logs] = await Promise.all([
    getCmsProjects(),
    getAdminStats(),
    readSecurityAudit(100),
  ]);

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentLogs = logs.filter((e) => new Date(e.at).getTime() >= dayAgo);

  const categoryMap = new Map<string, number>();
  let featuredCount = 0;
  let carouselCount = 0;
  let totalSlides = 0;

  for (const project of projects) {
    if (project.featured) featuredCount++;
    const slides = project.images?.length ?? 1;
    if ((project.images?.length ?? 0) > 1) carouselCount++;
    totalSlides += slides;
    categoryMap.set(project.category, (categoryMap.get(project.category) ?? 0) + 1);
  }

  return {
    gallery: {
      projectCount: projects.length,
      featuredCount,
      carouselCount,
      totalSlides,
      categories: [...categoryMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    },
    activity: {
      logEvents24h: recentLogs.length,
      cmsUpdates: recentLogs.filter((e) => e.type === "cms_update").length,
      failedLogins: recentLogs.filter((e) => e.type === "login_failed").length,
    },
    site: {
      storage: getStorageMode(),
      enquiriesTotal: stats.enquiries.total,
      enquiriesWeek: stats.enquiries.thisWeek,
      pageViewsTotal: stats.pageViews.total,
      conversionRate: stats.conversionRate,
      topServices: stats.enquiries.byService.slice(0, 5),
    },
  };
}
