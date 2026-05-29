import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats, getStorageMode } from "@/lib/store";
import { BarChart3, Eye, Inbox, Percent, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: typeof Inbox;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
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
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();
  const storage = getStorageMode();

  return (
    <div className="section-pad py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin</p>
          <h1 className="text-2xl font-black text-ek-navy uppercase sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-ek-muted">
            Storage: <span className="font-semibold text-ek-navy">{storage}</span>
            {storage === "file" && " (local dev — use Supabase on Vercel)"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            View site
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <AdminNav />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total enquiries" value={stats.enquiries.total} icon={Inbox} />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ek-navy/8 text-xs tracking-wide text-ek-muted uppercase">
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Service</th>
                <th className="px-6 py-3 font-semibold">Contact</th>
                <th className="px-6 py-3 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-ek-muted">
                    No enquiries yet. Submit the contact form on the site to test.
                  </td>
                </tr>
              ) : (
                stats.recentEnquiries.map((e) => (
                  <tr key={e.id} className="border-b border-ek-navy/5 hover:bg-ek-gray/50">
                    <td className="px-6 py-4 whitespace-nowrap text-ek-muted">
                      {new Date(e.createdAt).toLocaleString("en-AU")}
                    </td>
                    <td className="px-6 py-4 font-medium text-ek-navy">{e.name}</td>
                    <td className="px-6 py-4 text-ek-muted">{e.service ?? "—"}</td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${e.email}`} className="text-ek-teal hover:underline">
                        {e.email}
                      </a>
                      {e.phone && (
                        <p className="text-xs text-ek-muted">{e.phone}</p>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-ek-muted" title={e.message}>
                      {e.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
