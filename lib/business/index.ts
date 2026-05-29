import type {
  BusinessClient,
  BusinessInvoice,
  BusinessOrder,
  BusinessStats,
  InvoiceStatus,
  OrderStatus,
} from "@/lib/store/types";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/store/supabase-store";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function mapClient(row: Record<string, unknown>): BusinessClient {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    name: row.name as string,
    email: (row.email as string | null) ?? undefined,
    phone: (row.phone as string | null) ?? undefined,
    company: (row.company as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
  };
}

function mapOrder(row: Record<string, unknown>): BusinessOrder {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    clientId: (row.client_id as string | null) ?? undefined,
    enquiryId: (row.enquiry_id as string | null) ?? undefined,
    title: row.title as string,
    status: row.status as OrderStatus,
    description: (row.description as string | null) ?? undefined,
    revenueCents: Number(row.revenue_cents ?? 0),
    costCents: Number(row.cost_cents ?? 0),
  };
}

function mapInvoice(row: Record<string, unknown>): BusinessInvoice {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    orderId: (row.order_id as string | null) ?? undefined,
    clientId: (row.client_id as string | null) ?? undefined,
    invoiceNumber: row.invoice_number as string,
    status: row.status as InvoiceStatus,
    amountCents: Number(row.amount_cents ?? 0),
    gstCents: Number(row.gst_cents ?? 0),
    totalCents: Number(row.total_cents ?? 0),
    dueDate: (row.due_date as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
  };
}

export { formatAud } from "@/lib/business/format";

export async function getBusinessStats(): Promise<BusinessStats> {
  if (!isSupabaseConfigured()) {
    const { fileGetBusinessStats } = await import("@/lib/business/file-business");
    return fileGetBusinessStats();
  }

  const client = getClient();
  if (!client) {
    return emptyStats();
  }

  const [ordersRes, invoicesRes, clientsRes] = await Promise.all([
    client.from("business_orders").select("status, revenue_cents, cost_cents"),
    client.from("business_invoices").select("status, total_cents"),
    client.from("business_clients").select("id", { count: "exact", head: true }),
  ]);

  if (ordersRes.error) throw ordersRes.error;
  if (invoicesRes.error) throw invoicesRes.error;
  if (clientsRes.error) throw clientsRes.error;

  const orders = ordersRes.data ?? [];
  const invoices = invoicesRes.data ?? [];

  let revenueCents = 0;
  let costCents = 0;
  let ordersActive = 0;

  for (const o of orders) {
    revenueCents += Number(o.revenue_cents ?? 0);
    costCents += Number(o.cost_cents ?? 0);
    if (["quoted", "accepted", "in_progress"].includes(o.status)) ordersActive++;
  }

  const marginCents = revenueCents - costCents;
  const marginPercent =
    revenueCents > 0 ? Math.round((marginCents / revenueCents) * 1000) / 10 : 0;

  let invoicesPaid = 0;
  let invoicesOutstandingCents = 0;

  for (const inv of invoices) {
    if (inv.status === "paid") invoicesPaid++;
    if (inv.status === "sent" || inv.status === "overdue") {
      invoicesOutstandingCents += Number(inv.total_cents ?? 0);
    }
  }

  return {
    revenueCents,
    costCents,
    marginCents,
    marginPercent,
    ordersTotal: orders.length,
    ordersActive,
    invoicesTotal: invoices.length,
    invoicesPaid,
    invoicesOutstandingCents,
    clientsTotal: clientsRes.count ?? 0,
  };
}

function emptyStats(): BusinessStats {
  return {
    revenueCents: 0,
    costCents: 0,
    marginCents: 0,
    marginPercent: 0,
    ordersTotal: 0,
    ordersActive: 0,
    invoicesTotal: 0,
    invoicesPaid: 0,
    invoicesOutstandingCents: 0,
    clientsTotal: 0,
  };
}

export async function listOrders(): Promise<BusinessOrder[]> {
  if (!isSupabaseConfigured()) {
    const { fileListOrders } = await import("@/lib/business/file-business");
    return fileListOrders();
  }
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("business_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

export async function listInvoices(): Promise<BusinessInvoice[]> {
  if (!isSupabaseConfigured()) {
    const { fileListInvoices } = await import("@/lib/business/file-business");
    return fileListInvoices();
  }
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("business_invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapInvoice);
}

export async function listClients(): Promise<BusinessClient[]> {
  if (!isSupabaseConfigured()) {
    const { fileListClients } = await import("@/lib/business/file-business");
    return fileListClients();
  }
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("business_clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapClient);
}

export async function createOrder(input: {
  title: string;
  clientId?: string;
  enquiryId?: string;
  description?: string;
  revenueCents: number;
  costCents: number;
  status?: OrderStatus;
}): Promise<BusinessOrder> {
  if (!isSupabaseConfigured()) {
    const { fileCreateOrder } = await import("@/lib/business/file-business");
    return fileCreateOrder(input);
  }
  const client = getClient();
  if (!client) throw new Error("Supabase not configured");

  const { data, error } = await client
    .from("business_orders")
    .insert({
      title: input.title,
      client_id: input.clientId ?? null,
      enquiry_id: input.enquiryId ?? null,
      description: input.description ?? null,
      revenue_cents: input.revenueCents,
      cost_cents: input.costCents,
      status: input.status ?? "draft",
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapOrder(data);
}

export async function createInvoice(input: {
  invoiceNumber: string;
  clientId?: string;
  orderId?: string;
  amountCents: number;
  gstCents?: number;
  totalCents?: number;
  status?: InvoiceStatus;
  dueDate?: string;
  notes?: string;
}): Promise<BusinessInvoice> {
  const gst = input.gstCents ?? Math.round(input.amountCents * 0.1);
  const total = input.totalCents ?? input.amountCents + gst;

  if (!isSupabaseConfigured()) {
    const { fileCreateInvoice } = await import("@/lib/business/file-business");
    return fileCreateInvoice({ ...input, gstCents: gst, totalCents: total });
  }

  const client = getClient();
  if (!client) throw new Error("Supabase not configured");

  const { data, error } = await client
    .from("business_invoices")
    .insert({
      invoice_number: input.invoiceNumber,
      client_id: input.clientId ?? null,
      order_id: input.orderId ?? null,
      amount_cents: input.amountCents,
      gst_cents: gst,
      total_cents: total,
      status: input.status ?? "draft",
      due_date: input.dueDate ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapInvoice(data);
}

export async function updateInvoice(
  id: string,
  patch: Partial<{ status: InvoiceStatus; notes: string }>,
): Promise<BusinessInvoice> {
  if (!isSupabaseConfigured()) {
    const { fileUpdateInvoice } = await import("@/lib/business/file-business");
    return fileUpdateInvoice(id, patch);
  }
  const client = getClient();
  if (!client) throw new Error("Supabase not configured");

  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status) row.status = patch.status;
  if (patch.notes !== undefined) row.notes = patch.notes;

  const { data, error } = await client
    .from("business_invoices")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapInvoice(data);
}

export async function updateOrder(
  id: string,
  patch: Partial<{
    status: OrderStatus;
    title: string;
    revenueCents: number;
    costCents: number;
    description: string;
  }>,
): Promise<BusinessOrder> {
  if (!isSupabaseConfigured()) {
    const { fileUpdateOrder } = await import("@/lib/business/file-business");
    return fileUpdateOrder(id, patch);
  }
  const client = getClient();
  if (!client) throw new Error("Supabase not configured");

  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status) row.status = patch.status;
  if (patch.title) row.title = patch.title;
  if (patch.revenueCents !== undefined) row.revenue_cents = patch.revenueCents;
  if (patch.costCents !== undefined) row.cost_cents = patch.costCents;
  if (patch.description !== undefined) row.description = patch.description;

  const { data, error } = await client
    .from("business_orders")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapOrder(data);
}

export async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const invoices = await listInvoices();
  const prefix = `INV-${year}-`;
  const nums = invoices
    .filter((i) => i.invoiceNumber.startsWith(prefix))
    .map((i) => parseInt(i.invoiceNumber.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}
