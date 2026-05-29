"use client";

import type { AdminStats } from "@/lib/store/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DashboardCharts({ stats }: { stats: AdminStats }) {
  const viewsData = stats.pageViews.last7Days.map((d) => ({
    label: new Date(d.date).toLocaleDateString("en-AU", { weekday: "short" }),
    views: d.count,
  }));

  const serviceData = stats.enquiries.byService.slice(0, 6);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
          Page views (7 days)
        </h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecef" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="views" fill="#1eb8a8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
          Enquiries by service
        </h3>
        <div className="mt-4 h-64">
          {serviceData.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-ek-muted">
              No enquiries yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecef" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="service"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#0f1f26" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
