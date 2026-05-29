import { verifyAdminSession } from "@/lib/auth";
import {
  createInvoice,
  createOrder,
  formatAud,
  getBusinessStats,
  listInvoices,
  listOrders,
  nextInvoiceNumber,
  updateInvoice,
  updateOrder,
} from "@/lib/business";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizeText } from "@/lib/security/sanitize";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [stats, orders, invoices] = await Promise.all([
      getBusinessStats(),
      listOrders(),
      listInvoices(),
    ]);

    return NextResponse.json({
      stats,
      orders,
      invoices,
      formatted: {
        revenue: formatAud(stats.revenueCents),
        cost: formatAud(stats.costCents),
        margin: formatAud(stats.marginCents),
        outstanding: formatAud(stats.invoicesOutstandingCents),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load business data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const orderSchema = z.object({
  type: z.literal("order"),
  title: z.string().min(1).max(300),
  description: z.string().max(8000).optional(),
  enquiryId: z.string().uuid().optional(),
  revenueCents: z.number().int().min(0),
  costCents: z.number().int().min(0),
  status: z
    .enum(["draft", "quoted", "accepted", "in_progress", "completed", "cancelled"])
    .optional(),
});

const invoiceSchema = z.object({
  type: z.literal("invoice"),
  orderId: z.string().uuid().optional(),
  amountCents: z.number().int().min(0),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
  notes: z.string().max(4000).optional(),
});

const patchSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("order"),
    id: z.string().uuid(),
    status: z
      .enum(["draft", "quoted", "accepted", "in_progress", "completed", "cancelled"])
      .optional(),
    revenueCents: z.number().int().min(0).optional(),
    costCents: z.number().int().min(0).optional(),
  }),
  z.object({
    kind: z.literal("invoice"),
    id: z.string().uuid(),
    status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
    notes: z.string().max(4000).optional(),
  }),
]);

export async function POST(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-business", max: 40, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = (body as { type?: string })?.type;

  if (type === "order") {
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const order = await createOrder({
      title: sanitizeText(parsed.data.title, 300),
      description: parsed.data.description
        ? sanitizeText(parsed.data.description, 8000)
        : undefined,
      enquiryId: parsed.data.enquiryId,
      revenueCents: parsed.data.revenueCents,
      costCents: parsed.data.costCents,
      status: parsed.data.status,
    });
    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Order created ${order.title}`,
    });
    return NextResponse.json({ order });
  }

  if (type === "invoice") {
    const parsed = invoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid invoice" }, { status: 400 });
    }
    const invoice = await createInvoice({
      invoiceNumber: await nextInvoiceNumber(),
      orderId: parsed.data.orderId,
      amountCents: parsed.data.amountCents,
      status: parsed.data.status,
      notes: parsed.data.notes ? sanitizeText(parsed.data.notes, 4000) : undefined,
    });
    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Invoice created ${invoice.invoiceNumber}`,
    });
    return NextResponse.json({ invoice });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function PATCH(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-business", max: 60, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (parsed.data.kind === "order") {
    const order = await updateOrder(parsed.data.id, {
      status: parsed.data.status,
      revenueCents: parsed.data.revenueCents,
      costCents: parsed.data.costCents,
    });
    return NextResponse.json({ order });
  }

  const invoice = await updateInvoice(parsed.data.id, {
    status: parsed.data.status,
    notes: parsed.data.notes ? sanitizeText(parsed.data.notes, 4000) : undefined,
  });
  return NextResponse.json({ invoice });
}
