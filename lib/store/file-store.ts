import type { AdminStats, Enquiry, PageView } from "@/lib/store/types";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "store.json");

type Database = {
  enquiries: Enquiry[];
  pageViews: PageView[];
};

async function readDb(): Promise<Database> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Database;
  } catch {
    return { enquiries: [], pageViews: [] };
  }
}

async function writeDb(db: Database) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function startOfWeek(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function buildStats(db: Database): AdminStats {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const enquiries = db.enquiries;
  const thisWeek = enquiries.filter((e) => new Date(e.createdAt) >= weekStart).length;
  const thisMonth = enquiries.filter((e) => new Date(e.createdAt) >= monthStart).length;

  const serviceMap = new Map<string, number>();
  for (const e of enquiries) {
    const key = e.service || "General";
    serviceMap.set(key, (serviceMap.get(key) ?? 0) + 1);
  }
  const byService = [...serviceMap.entries()]
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  const last7Days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = db.pageViews.filter((v) => v.createdAt.startsWith(key)).length;
    last7Days.push({ date: key, count });
  }

  const views7d = last7Days.reduce((s, d) => s + d.count, 0);
  const enquiries7d = enquiries.filter((e) => {
    const created = new Date(e.createdAt);
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 7);
    return created >= cutoff;
  }).length;

  return {
    enquiries: {
      total: enquiries.length,
      thisWeek,
      thisMonth,
      byService,
    },
    pageViews: {
      total: db.pageViews.length,
      last7Days,
    },
    conversionRate: views7d > 0 ? Math.round((enquiries7d / views7d) * 1000) / 10 : 0,
    recentEnquiries: [...enquiries]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 20),
    storage: "file",
  };
}

export async function fileSaveEnquiry(
  data: Omit<Enquiry, "id" | "createdAt">,
): Promise<Enquiry> {
  const db = await readDb();
  const enquiry: Enquiry = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  db.enquiries.push(enquiry);
  await writeDb(db);
  return enquiry;
}

export async function fileSavePageView(path: string, referrer?: string): Promise<void> {
  const db = await readDb();
  db.pageViews.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    path,
    referrer,
  });
  if (db.pageViews.length > 5000) {
    db.pageViews = db.pageViews.slice(-5000);
  }
  await writeDb(db);
}

export async function fileGetStats(): Promise<AdminStats> {
  const db = await readDb();
  return buildStats(db);
}
