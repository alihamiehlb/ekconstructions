"use client";

import type { AdminInsights } from "@/lib/admin/insights";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Hash,
  Image,
  Layers,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

function Meter({
  label,
  value,
  max,
  color = "bg-ek-teal",
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium text-ek-muted">{label}</span>
        <span className="font-bold text-ek-navy">
          {value}/{max} ({pct}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ek-gray">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  );
}

export function AdminInsightsPanel({ insights }: { insights: AdminInsights }) {
  const ig = insights.instagram;

  return (
    <div className="admin-card grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
              Instagram health
            </h2>
            <p className="mt-1 text-xs text-ek-muted">
              Gallery content from synced posts · last sync{" "}
              {ig.lastSynced
                ? new Date(ig.lastSynced).toLocaleString("en-AU")
                : "never"}
            </p>
          </div>
          <Link href="/admin/instagram" className="btn-primary px-4 py-2 text-[10px]">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Manage
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Image, label: "Posts", value: ig.postCount },
            { icon: Layers, label: "Carousels", value: ig.carouselCount },
            { icon: Hash, label: "Slides", value: ig.totalSlides },
            { icon: MessageSquare, label: "Captions", value: ig.withCaption },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-ek-navy/8 bg-ek-gray/25 p-4"
            >
              <Icon className="h-4 w-4 text-ek-teal" aria-hidden />
              <p className="mt-2 text-2xl font-black text-ek-navy">{value}</p>
              <p className="text-[10px] font-semibold tracking-wide text-ek-muted uppercase">
                {label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <Meter label="Caption coverage" value={ig.withCaption} max={ig.postCount || 1} />
          <Meter
            label="Saved URLs"
            value={ig.savedUrlCount}
            max={Math.max(ig.savedUrlCount, ig.postCount, 1)}
            color="bg-ek-navy"
          />
        </div>

        {ig.categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {ig.categories.map((c) => (
              <span
                key={c.name}
                className="rounded-full bg-ek-teal/10 px-3 py-1 text-[10px] font-bold text-ek-teal uppercase"
              >
                {c.name} · {c.count}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-ek-navy/10 bg-gradient-to-br from-ek-navy to-ek-navy-light p-6 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-ek-teal" aria-hidden />
          <h2 className="text-sm font-bold tracking-wide uppercase">System status</h2>
        </div>

        <div className="mt-5 space-y-3">
          <StatusPill ok={ig.supabaseConfigured} label="Supabase feed" />
          <StatusPill ok={insights.site.storage === "supabase"} label="Database storage" />
          <StatusPill ok={ig.sessionConfigured} label="Instagram session" />
          <StatusPill ok={ig.postCount > 0} label="Gallery populated" />
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-white/60">Logs (24h)</dt>
            <dd className="font-bold">{insights.activity.logEvents24h}</dd>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-white/60">Sync events</dt>
            <dd className="font-bold">{insights.activity.syncEvents}</dd>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-white/60">Failed logins</dt>
            <dd className="font-bold">{insights.activity.failedLogins}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/60">Conversion</dt>
            <dd className="font-bold text-ek-teal">{insights.site.conversionRate}%</dd>
          </div>
        </dl>

        {!ig.sessionConfigured && (
          <p className="mt-5 rounded-lg bg-white/10 p-3 text-xs leading-relaxed text-white/80">
            Add <code className="text-ek-teal">INSTAGRAM_SESSION_ID</code> in Vercel env for
            discover + captions.
          </p>
        )}

        <Link
          href="/admin/logs"
          className="mt-5 inline-flex text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
        >
          View activity logs →
        </Link>
      </section>
    </div>
  );
}
