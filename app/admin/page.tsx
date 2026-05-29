import { AdminEnquiriesPanel } from "@/components/admin/AdminEnquiriesPanel";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { requireAdmin } from "@/lib/auth";
import { readInstagramFeed } from "@/lib/instagram/feed";
import { isSupabaseFeedConfigured } from "@/lib/instagram/supabase-feed";
import { getAdminStats, getStorageMode } from "@/lib/store";
import { BarChart3, Eye, Image, Inbox, Instagram, Percent, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  icon: typeof Inbox;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm transition hover:border-ek-teal/25 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-ek-muted uppercase">{label}</p>
          <p className="mt-2 text-3xl font-black text-ek-navy">{value}</p>
          {hint && <p className="mt-1 text-xs text-ek-muted">{hint}</p>}
        </div>
        <div className="rounded-xl bg-ek-teal/10 p-3 text-ek-teal">
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
  const [stats, feed] = await Promise.all([getAdminStats(), readInstagramFeed()]);
  const storage = getStorageMode();
  const igStorage = isSupabaseFeedConfigured();

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Dashboard"
        badge={storage === "supabase" ? "Secure · Supabase" : "Local file mode"}
        description={
          storage === "supabase"
            ? "Database, CMS, and Instagram feed use Supabase with RLS (server-only access)."
            : "Running on local file storage — configure Supabase on Vercel for production."
        }
      />

      <AdminNav />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total enquiries" value={stats.enquiries.total} icon={Inbox} href="/admin" />
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

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Instagram posts"
          value={feed.posts.length}
          icon={Instagram}
          hint={igStorage ? "Synced to Supabase" : "File backup only"}
          href="/admin/instagram"
        />
        <StatCard label="Gallery projects" value="CMS" icon={Image} href="/admin/projects" />
        <StatCard label="Security log" value="Audit" icon={Shield} href="/admin/security" />
      </div>

      <div className="mt-8">
        <DashboardCharts stats={stats} />
      </div>

      <div className="mt-8 rounded-2xl border border-ek-navy/10 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-ek-navy/8 px-6 py-4">
          <BarChart3 className="h-5 w-5 text-ek-teal" aria-hidden />
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
            Recent enquiries
          </h2>
        </div>
        <AdminEnquiriesPanel enquiries={stats.recentEnquiries} />
      </div>
    </div>
  );
}
