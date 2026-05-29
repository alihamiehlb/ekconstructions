"use client";

import type { BusinessInvoice, BusinessOrder, BusinessStats } from "@/lib/store/types";
import { formatAud } from "@/lib/business/format";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  stats: BusinessStats;
  orders: BusinessOrder[];
  invoices: BusinessInvoice[];
};

export function AdminBusinessHub({ stats: initialStats, orders: initialOrders, invoices: initialInvoices }: Props) {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [orders, setOrders] = useState(initialOrders);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [message, setMessage] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/business", { credentials: "same-origin" });
    const json = await res.json();
    if (res.ok) {
      setStats(json.stats);
      setOrders(json.orders);
      setInvoices(json.invoices);
    }
  }

  async function addOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await secureJsonFetch("/api/admin/business", {
      method: "POST",
      body: JSON.stringify({
        type: "order",
        title: fd.get("title"),
        revenueCents: Math.round(Number(fd.get("revenue")) * 100),
        costCents: Math.round(Number(fd.get("cost")) * 100),
        status: "draft",
      }),
    });
    if (res.ok) {
      setMessage("Order added");
      e.currentTarget.reset();
      await refresh();
      router.refresh();
    }
  }

  async function addInvoice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await secureJsonFetch("/api/admin/business", {
      method: "POST",
      body: JSON.stringify({
        type: "invoice",
        amountCents: Math.round(Number(fd.get("amount")) * 100),
        status: "draft",
      }),
    });
    if (res.ok) {
      setMessage("Invoice created");
      e.currentTarget.reset();
      await refresh();
      router.refresh();
    }
  }

  async function markInvoicePaid(id: string) {
    await secureJsonFetch("/api/admin/business", {
      method: "PATCH",
      body: JSON.stringify({ kind: "invoice", id, status: "paid" }),
    });
    await refresh();
  }

  const statCards = [
    { label: "Revenue", value: formatAud(stats.revenueCents) },
    { label: "Costs", value: formatAud(stats.costCents) },
    { label: "Margin", value: `${formatAud(stats.marginCents)} (${stats.marginPercent}%)` },
    { label: "Outstanding", value: formatAud(stats.invoicesOutstandingCents) },
    { label: "Active orders", value: stats.ordersActive },
    { label: "Paid invoices", value: `${stats.invoicesPaid}/${stats.invoicesTotal}` },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-5"
          >
            <p className="text-[10px] font-semibold tracking-wide text-ek-muted uppercase">
              {card.label}
            </p>
            <p className="mt-2 text-xl font-black text-ek-navy">{card.value}</p>
          </div>
        ))}
      </div>

      {message && <p className="text-sm text-ek-teal">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={addOrder}
          className="admin-card space-y-3 rounded-2xl border border-ek-navy/10 bg-white p-6"
        >
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">New order / job</h2>
          <input
            name="title"
            required
            placeholder="Job title"
            className="w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="revenue"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="Revenue AUD"
              className="rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
            />
            <input
              name="cost"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="Cost AUD"
              className="rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="btn-primary">
            Add order
          </button>
        </form>

        <form
          onSubmit={addInvoice}
          className="admin-card space-y-3 rounded-2xl border border-ek-navy/10 bg-white p-6"
        >
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">New invoice</h2>
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="Amount ex GST (AUD)"
            className="w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
          />
          <p className="text-xs text-ek-muted">GST (10%) and invoice number are added automatically.</p>
          <button type="submit" className="btn-primary">
            Create invoice
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card overflow-hidden rounded-2xl border border-ek-navy/10 bg-white">
          <div className="border-b border-ek-navy/8 px-6 py-4">
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Orders</h2>
          </div>
          <ul className="divide-y divide-ek-navy/8">
            {orders.map((o) => (
              <li key={o.id} className="px-6 py-4 text-sm">
                <p className="font-semibold text-ek-navy">{o.title}</p>
                <p className="text-ek-muted">
                  {o.status} · Rev {formatAud(o.revenueCents)} · Cost {formatAud(o.costCents)} ·
                  Margin {formatAud(o.revenueCents - o.costCents)}
                </p>
              </li>
            ))}
            {orders.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-ek-muted">No orders yet</li>
            )}
          </ul>
        </div>

        <div className="admin-card overflow-hidden rounded-2xl border border-ek-navy/10 bg-white">
          <div className="border-b border-ek-navy/8 px-6 py-4">
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Invoices</h2>
          </div>
          <ul className="divide-y divide-ek-navy/8">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-3 px-6 py-4 text-sm">
                <div>
                  <p className="font-semibold text-ek-navy">{inv.invoiceNumber}</p>
                  <p className="text-ek-muted">
                    {inv.status} · {formatAud(inv.totalCents)} inc GST
                  </p>
                </div>
                {inv.status !== "paid" && (
                  <button
                    type="button"
                    onClick={() => markInvoicePaid(inv.id)}
                    className="text-[10px] font-bold tracking-wide text-ek-teal uppercase"
                  >
                    Mark paid
                  </button>
                )}
              </li>
            ))}
            {invoices.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-ek-muted">No invoices yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
