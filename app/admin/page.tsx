import { AdminEnquiriesPanel } from "@/components/admin/AdminEnquiriesPanel";
import { AdminInsightsPanel } from "@/components/admin/AdminInsightsPanel";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { getAdminInsights } from "@/lib/admin/insights";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats, getStorageMode } from "@/lib/store";
import {
  BarChart3,
  Eye,
  Image,
  Inbox,
  Instagram,
  Layers,
  MessageSquare,
  Percent,
  Shield,
  Terminal,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof Inbox;
  hint?: string;
  href?: string;
  accent?: string;
}) {
  const inner = (
    <div
      className={`admin-stat-card rounded-2xl border border-ek-navy/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ek-teal/25 hover:shadow-md sm:p-6 ${accent ?? ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-ek-muted uppercase sm:text-xs">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-ek-navy sm:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-ek-muted">{hint}</p>}
        </div>
        <div className="rounded-xl bg-ek-teal/10 p-2.5 text-ek-teal sm:p-3">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  let stats;
  let insights;
  let loadError: string | undefined;

  try {
    [stats, insights] = await Promise.all([getAdminStats(), getAdminInsights()]);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Dashboard data unavailable.";
    console.error("AdminDashboardPage:", error);
    stats = {
      enquiries: { total: 0, thisWeek: 0, thisMonth: 0, byService: [] },
      pageViews: { total: 0, last7Days: [] },
      conversionRate: 0,
      recentEnquiries: [],
      storage: getStorageMode(),
    };
    insights = {
      instagram: {
        postCount: 0,
        carouselCount: 0,
        totalSlides: 0,
        withCaption: 0,
        withoutCaption: 0,
        captionCoverage: 0,
        savedUrlCount: 0,
        lastSynced: null,
        categories: [],
        supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        sessionConfigured: Boolean(process.env.INSTAGRAM_SESSION_ID?.trim()),
      },
      site: {
        storage: getStorageMode(),
        enquiriesTotal: 0,
        enquiriesWeek: 0,
        pageViewsTotal: 0,
        conversionRate: 0,
        topServices: [],
      },
      activity: { logEvents24h: 0, syncEvents: 0, failedLogins: 0 },
    };
  }

  const storage = getStorageMode();
  const ig = insights.instagram;

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Dashboard"
        badge={storage === "supabase" ? "Secure · Supabase" : "Local file mode"}
        description={
          storage === "supabase"
            ? "Full management hub — enquiries, Instagram gallery, logs, and site content."
            : "Configure Supabase on Vercel for production persistence."
        }
      />

      <AdminNav />

      {loadError && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {loadError}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total enquiries" value={stats.enquiries.total} icon={Inbox} href="/admin/inquiries" />
        <StatCard
          label="This week"
          value={stats.enquiries.thisWeek}
          icon={TrendingUp}
          hint={`${stats.enquiries.thisMonth} this month`}
        />
        <StatCard label="Page views" value={stats.pageViews.total} icon={Eye} />
        <StatCard
          label="Conversion (7d)"
          value={`${stats.conversionRate}%`}
          icon={Percent}
          hint="Enquiries ÷ views"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="IG posts"
          value={ig.postCount}
          icon={Instagram}
          href="/admin/instagram"
        />
        <StatCard label="Carousels" value={ig.carouselCount} icon={Layers} />
        <StatCard
          label="Captions"
          value={`${ig.captionCoverage}%`}
          icon={MessageSquare}
          hint={`${ig.withCaption} with text`}
        />
        <StatCard label="Gallery" value="CMS" icon={Image} href="/admin/projects" />
        <StatCard label="Logs" value={insights.activity.logEvents24h} icon={Terminal} href="/admin/logs" hint="Last 24h" />
        <StatCard label="Security" value="Audit" icon={Shield} href="/admin/security" />
      </div>

      <div className="mt-8">
        <AdminInsightsPanel insights={insights} />
      </div>

      <AdminQuickActions />

      <div className="mt-8">
        <DashboardCharts stats={stats} />
      </div>

      <div className="admin-card mt-8 rounded-2xl border border-ek-navy/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ek-navy/8 px-6 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-ek-teal" aria-hidden />
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
              Recent enquiries
            </h2>
          </div>
          <Link href="/admin/inquiries" className="text-xs font-semibold text-ek-teal uppercase hover:underline">
            Manage all →
          </Link>
        </div>
        <AdminEnquiriesPanel enquiries={stats.recentEnquiries} />
      </div>
    </div>
  );
}
