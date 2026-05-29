import { AdminLogsPanel } from "@/components/admin/AdminLogsPanel";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth";
import { readSecurityAudit } from "@/lib/security/audit";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Logs" };

export default async function AdminLogsPage() {
  await requireAdmin();
  const events = await readSecurityAudit(100);

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Logs"
        badge="Live"
        description="Activity from Instagram sync, admin actions, security events, and errors. Mirrored to Vercel Runtime Logs as structured JSON."
      />

      <AdminNav />

      <section className="admin-card mt-8 rounded-2xl border border-ek-teal/20 bg-gradient-to-br from-ek-teal/5 to-white p-5 sm:p-6">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Vercel runtime logs</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ek-muted">
          Every server event is logged as JSON (level, source, message, context). Open your Vercel
          project dashboard → <strong>Logs</strong> → filter by{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-ek-navy">instagram.sync</code> or{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-ek-navy">app_error</code>.
        </p>
        <Link
          href="https://vercel.com/docs/observability/runtime-logs"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
        >
          Vercel logging docs
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </section>

      <div className="mt-6">
        <AdminLogsPanel initialEvents={events} />
      </div>
    </div>
  );
}
