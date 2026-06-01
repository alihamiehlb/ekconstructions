"use client";

import type { AuditEvent } from "@/lib/security/audit";
import { AlertCircle, CheckCircle2, Info, RefreshCw, Terminal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const LEVEL_STYLES: Record<string, { icon: typeof Info; className: string; label: string }> = {
  app_info: { icon: Info, className: "text-ek-teal bg-ek-teal/10", label: "Info" },
  app_warn: { icon: AlertCircle, className: "text-ek-orange bg-ek-orange/10", label: "Warn" },
  app_error: { icon: AlertCircle, className: "text-red-600 bg-red-50", label: "Error" },
  instagram_sync: { icon: CheckCircle2, className: "text-ek-teal bg-ek-teal/10", label: "Sync" },
  instagram_discover: { icon: CheckCircle2, className: "text-ek-teal bg-ek-teal/10", label: "Discover" },
  login_success: { icon: CheckCircle2, className: "text-ek-navy bg-ek-gray", label: "Login" },
  login_failed: { icon: AlertCircle, className: "text-red-600 bg-red-50", label: "Failed login" },
};

function parseDetail(detail?: string): { message?: string; source?: string; context?: Record<string, unknown> } {
  if (!detail) return {};
  try {
    return JSON.parse(detail) as { message?: string; source?: string; context?: Record<string, unknown> };
  } catch {
    return { message: detail };
  }
}

type Props = {
  initialEvents: AuditEvent[];
};

export function AdminLogsPanel({ initialEvents }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logs?limit=100", { credentials: "same-origin" });
      const data = (await res.json()) as { events?: AuditEvent[] };
      if (data.events) setEvents(data.events);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const types = ["all", ...Array.from(new Set(events.map((e) => e.type)))];
  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <div className="admin-card overflow-hidden rounded-2xl border border-ek-navy/10 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ek-navy/8 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-ek-teal" aria-hidden />
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Activity log</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-ek-navy/10 bg-ek-gray/40 px-3 py-2 text-xs font-medium text-ek-navy"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All events" : t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-ek-navy px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase transition hover:bg-ek-navy-light disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto overscroll-y-contain">
        {filtered.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ek-muted">No log entries yet.</p>
        ) : (
          <ul className="divide-y divide-ek-navy/5">
            {filtered.map((event, i) => {
              const style = LEVEL_STYLES[event.type] ?? {
                icon: Info,
                className: "text-ek-muted bg-ek-gray/60",
                label: event.type,
              };
              const Icon = style.icon;
              const parsed = parseDetail(event.detail);

              return (
                <li
                  key={`${event.at}-${i}`}
                  className="flex gap-4 px-5 py-4 sm:px-6"
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.className}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wide text-ek-navy uppercase">
                        {style.label}
                      </span>
                      <span className="text-[10px] text-ek-muted">
                        {new Date(event.at).toLocaleString("en-AU")}
                      </span>
                      {event.ip && (
                        <span className="rounded bg-ek-gray/80 px-2 py-0.5 text-[10px] text-ek-muted">
                          {event.ip}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ek-navy">
                      {parsed.message ?? event.detail ?? event.type}
                    </p>
                    {parsed.source && (
                      <p className="mt-1 text-xs text-ek-muted">Source: {parsed.source}</p>
                    )}
                    {parsed.context && Object.keys(parsed.context).length > 0 && (
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-ek-gray/50 p-2 text-[11px] leading-relaxed text-ek-muted">
                        {JSON.stringify(parsed.context, null, 2)}
                      </pre>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-ek-navy/8 bg-ek-gray/30 px-5 py-3 sm:px-6">
        <p className="text-xs leading-relaxed text-ek-muted">
          Logs auto-refresh every 30s. The same events are written as JSON to{" "}
          <strong className="font-semibold text-ek-navy">Vercel → Logs</strong> (Runtime) for
          production debugging.
        </p>
      </div>
    </div>
  );
}
