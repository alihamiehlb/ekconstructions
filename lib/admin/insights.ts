import { inferCategoryFromCaption } from "@/lib/instagram/caption-utils";
import { readInstagramFeed } from "@/lib/instagram/feed";
import { isSupabaseFeedConfigured } from "@/lib/instagram/supabase-feed";
import { readSecurityAudit } from "@/lib/security/audit";
import { getAdminStats, getStorageMode } from "@/lib/store";

export type AdminInsights = {
  instagram: {
    postCount: number;
    carouselCount: number;
    totalSlides: number;
    withCaption: number;
    withoutCaption: number;
    captionCoverage: number;
    savedUrlCount: number;
    lastSynced: string | null;
    categories: { name: string; count: number }[];
    supabaseConfigured: boolean;
    sessionConfigured: boolean;
  };
  activity: {
    logEvents24h: number;
    syncEvents: number;
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
  const [feed, stats, logs] = await Promise.all([
    readInstagramFeed(),
    getAdminStats(),
    readSecurityAudit(100),
  ]);

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentLogs = logs.filter((e) => new Date(e.at).getTime() >= dayAgo);

  const categoryMap = new Map<string, number>();
  let withCaption = 0;
  let carouselCount = 0;
  let totalSlides = 0;

  for (const post of feed.posts) {
    if (post.caption.trim()) withCaption++;
    if (post.isCarousel) carouselCount++;
    totalSlides += post.images.length;
    const cat = inferCategoryFromCaption(post.caption);
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }

  const postCount = feed.posts.length;

  return {
    instagram: {
      postCount,
      carouselCount,
      totalSlides,
      withCaption,
      withoutCaption: postCount - withCaption,
      captionCoverage: postCount > 0 ? Math.round((withCaption / postCount) * 100) : 0,
      savedUrlCount: feed.savedUrls?.length ?? 0,
      lastSynced: feed.syncedAt || null,
      categories: [...categoryMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      supabaseConfigured: isSupabaseFeedConfigured(),
      sessionConfigured: Boolean(process.env.INSTAGRAM_SESSION_ID?.trim()),
    },
    activity: {
      logEvents24h: recentLogs.length,
      syncEvents: recentLogs.filter(
        (e) => e.type === "instagram_sync" || e.type === "instagram_discover",
      ).length,
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
