import type { AdminStats, Enquiry } from "@/lib/store/types";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function supabaseSaveEnquiry(
  data: Omit<Enquiry, "id" | "createdAt">,
): Promise<Enquiry> {
  const client = getAdminClient();
  if (!client) throw new Error("Supabase not configured");

  const { data: row, error } = await client
    .from("enquiries")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      service: data.service ?? null,
      message: data.message,
      source_ip: data.sourceIp ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    service: row.service ?? undefined,
    message: row.message,
    sourceIp: row.source_ip ?? undefined,
  };
}

export async function supabaseSavePageView(path: string, referrer?: string) {
  const client = getAdminClient();
  if (!client) return;

  await client.from("page_views").insert({
    path,
    referrer: referrer ?? null,
  });
}

export async function supabaseGetStats(): Promise<AdminStats> {
  const client = getAdminClient();
  if (!client) throw new Error("Supabase not configured");

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data: enquiries, error: e1 } = await client
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (e1) throw e1;

  const { data: pageViews, error: e2 } = await client
    .from("page_views")
    .select("created_at")
    .gte("created_at", weekAgo.toISOString());

  if (e2) throw e2;

  const mapped: Enquiry[] = (enquiries ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    service: row.service ?? undefined,
    message: row.message,
    sourceIp: row.source_ip ?? undefined,
  }));

  const thisWeek = mapped.filter((e) => new Date(e.createdAt) >= weekAgo).length;
  const thisMonth = mapped.filter((e) => new Date(e.createdAt) >= monthStart).length;

  const serviceMap = new Map<string, number>();
  for (const e of mapped) {
    const key = e.service || "General";
    serviceMap.set(key, (serviceMap.get(key) ?? 0) + 1);
  }

  const last7Days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = (pageViews ?? []).filter((v) => v.created_at.startsWith(key)).length;
    last7Days.push({ date: key, count });
  }

  const { count: totalViews } = await client
    .from("page_views")
    .select("*", { count: "exact", head: true });

  const views7d = last7Days.reduce((s, d) => s + d.count, 0);
  const enquiries7d = thisWeek;

  return {
    enquiries: {
      total: mapped.length,
      thisWeek,
      thisMonth,
      byService: [...serviceMap.entries()]
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count),
    },
    pageViews: {
      total: totalViews ?? 0,
      last7Days,
    },
    conversionRate: views7d > 0 ? Math.round((enquiries7d / views7d) * 1000) / 10 : 0,
    recentEnquiries: mapped.slice(0, 20),
    storage: "supabase",
  };
}
