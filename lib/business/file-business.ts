import type {
  BusinessClient,
  BusinessInvoice,
  BusinessOrder,
  BusinessStats,
  InvoiceStatus,
  OrderStatus,
} from "@/lib/store/types";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "business.json");

type Db = {
  clients: BusinessClient[];
  orders: BusinessOrder[];
  invoices: BusinessInvoice[];
};

async function readDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Db;
  } catch {
    return { clients: [], orders: [], invoices: [] };
  }
}

async function writeDb(db: Db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function fileGetBusinessStats(): Promise<BusinessStats> {
  const db = await readDb();
  let revenueCents = 0;
  let costCents = 0;
  let ordersActive = 0;

  for (const o of db.orders) {
    revenueCents += o.revenueCents;
    costCents += o.costCents;
    if (["quoted", "accepted", "in_progress"].includes(o.status)) ordersActive++;
  }

  const marginCents = revenueCents - costCents;
  const marginPercent =
    revenueCents > 0 ? Math.round((marginCents / revenueCents) * 1000) / 10 : 0;

  let invoicesPaid = 0;
  let invoicesOutstandingCents = 0;
  for (const inv of db.invoices) {
    if (inv.status === "paid") invoicesPaid++;
    if (inv.status === "sent" || inv.status === "overdue") {
      invoicesOutstandingCents += inv.totalCents;
    }
  }

  return {
    revenueCents,
    costCents,
    marginCents,
    marginPercent,
    ordersTotal: db.orders.length,
    ordersActive,
    invoicesTotal: db.invoices.length,
    invoicesPaid,
    invoicesOutstandingCents,
    clientsTotal: db.clients.length,
  };
}

export async function fileListOrders() {
  return (await readDb()).orders;
}

export async function fileListInvoices() {
  return (await readDb()).invoices;
}

export async function fileListClients() {
  return (await readDb()).clients;
}

export async function fileCreateOrder(input: {
  title: string;
  clientId?: string;
  enquiryId?: string;
  description?: string;
  revenueCents: number;
  costCents: number;
  status?: OrderStatus;
}): Promise<BusinessOrder> {
  const db = await readDb();
  const now = new Date().toISOString();
  const order: BusinessOrder = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    clientId: input.clientId,
    enquiryId: input.enquiryId,
    title: input.title,
    status: input.status ?? "draft",
    description: input.description,
    revenueCents: input.revenueCents,
    costCents: input.costCents,
  };
  db.orders.unshift(order);
  await writeDb(db);
  return order;
}

export async function fileCreateInvoice(input: {
  invoiceNumber: string;
  clientId?: string;
  orderId?: string;
  amountCents: number;
  gstCents: number;
  totalCents: number;
  status?: InvoiceStatus;
  dueDate?: string;
  notes?: string;
}): Promise<BusinessInvoice> {
  const db = await readDb();
  const now = new Date().toISOString();
  const invoice: BusinessInvoice = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    orderId: input.orderId,
    clientId: input.clientId,
    invoiceNumber: input.invoiceNumber,
    status: input.status ?? "draft",
    amountCents: input.amountCents,
    gstCents: input.gstCents,
    totalCents: input.totalCents,
    dueDate: input.dueDate,
    notes: input.notes,
  };
  db.invoices.unshift(invoice);
  await writeDb(db);
  return invoice;
}

export async function fileUpdateInvoice(
  id: string,
  patch: Partial<{ status: InvoiceStatus; notes: string }>,
) {
  const db = await readDb();
  const idx = db.invoices.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("Invoice not found");
  db.invoices[idx] = {
    ...db.invoices[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.invoices[idx];
}

export async function fileUpdateOrder(
  id: string,
  patch: Partial<{
    status: OrderStatus;
    title: string;
    revenueCents: number;
    costCents: number;
    description: string;
  }>,
) {
  const db = await readDb();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx < 0) throw new Error("Order not found");
  db.orders[idx] = {
    ...db.orders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.orders[idx];
}
