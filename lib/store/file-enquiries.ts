import type { Enquiry, EnquiryStatus } from "@/lib/store/types";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "store.json");

type Database = {
  enquiries: Enquiry[];
  pageViews: unknown[];
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

export async function fileListEnquiries(limit = 100): Promise<Enquiry[]> {
  const db = await readDb();
  return [...db.enquiries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((e) => ({ ...e, status: e.status ?? "new" }));
}

export async function fileUpdateEnquiry(
  id: string,
  patch: Partial<{ status: EnquiryStatus; notes: string; readAt: string | null }>,
): Promise<Enquiry> {
  const db = await readDb();
  const idx = db.enquiries.findIndex((e) => e.id === id);
  if (idx < 0) throw new Error("Enquiry not found");

  const { readAt, ...restPatch } = patch;
  const next: Enquiry = { ...db.enquiries[idx], ...restPatch };
  if (readAt === null) delete next.readAt;
  else if (readAt) next.readAt = readAt;
  db.enquiries[idx] = next;
  await writeDb(db);
  return next;
}

export async function fileDeleteEnquiry(id: string): Promise<void> {
  const db = await readDb();
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  await writeDb(db);
}
