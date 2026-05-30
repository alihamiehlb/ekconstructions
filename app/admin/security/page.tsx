import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdmin } from "@/lib/auth";
import { readSecurityAudit } from "@/lib/security/audit";
import Link from "next/link";
import { Shield, ShieldCheck } from "lucide-react";

export const metadata = { title: "Admin Security" };

const checklist = [
  "HTTPS + HSTS enabled in production",
  "CSRF tokens required on contact, login, CMS and logout",
  "Origin validation on API mutations",
  "Rate limiting on contact, login and CMS endpoints",
  "Input sanitisation (XSS/HTML stripping) on all user and CMS text",
  "Zod validation on API payloads",
  "Admin JWT session cookie (HTTP-only, SameSite=Strict)",
  "Parameterized Supabase queries (when database enabled)",
  "Security audit log for login and CMS events",
  "Content Security Policy and security response headers",
];

export default async function AdminSecurityPage() {
  await requireAdmin();
  const events = await readSecurityAudit(30);

  return (
    <div className="section-pad py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin</p>
          <h1 className="text-3xl font-black text-ek-navy uppercase">Security</h1>
          <p className="mt-1 text-sm text-ek-muted">
            Hardening status, audit trail and public security documentation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/logs"
            className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            Activity logs
          </Link>
          <Link
            href="/security"
            className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            Public security page
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-ek-teal" aria-hidden />
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
              Protection checklist
            </h2>
          </div>
          <ul className="mt-4 space-y-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ek-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ek-teal" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-ek-teal" aria-hidden />
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
              Recommendations
            </h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-ek-muted">
            <li>Use a strong unique `ADMIN_PASSWORD` and rotate `ADMIN_SECRET` periodically.</li>
            <li>Enable Supabase on production for durable enquiry storage with RLS.</li>
            <li>Set `NEXT_PUBLIC_SITE_URL` to your live domain for origin checks.</li>
            <li>Review audit events below after any failed login spikes.</li>
            <li>
              Keep dependencies updated: <code className="text-ek-navy">npm audit</code>
            </li>
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-ek-navy/10 bg-white shadow-sm">
        <div className="border-b border-ek-navy/8 px-6 py-4">
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
            Recent security events
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ek-navy/8 text-xs tracking-wide text-ek-muted uppercase">
                <th className="px-6 py-3 font-semibold">Time</th>
                <th className="px-6 py-3 font-semibold">Event</th>
                <th className="px-6 py-3 font-semibold">IP</th>
                <th className="px-6 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-ek-muted">
                    No events logged yet.
                  </td>
                </tr>
              ) : (
                events.map((e, i) => (
                  <tr key={`${e.at}-${i}`} className="border-b border-ek-navy/5">
                    <td className="px-6 py-3 whitespace-nowrap text-ek-muted">
                      {new Date(e.at).toLocaleString("en-AU")}
                    </td>
                    <td className="px-6 py-3 font-medium text-ek-navy">{e.type}</td>
                    <td className="px-6 py-3 text-ek-muted">{e.ip ?? "—"}</td>
                    <td className="px-6 py-3 text-ek-muted">{e.detail ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
