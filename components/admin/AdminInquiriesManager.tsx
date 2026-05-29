"use client";

import type { Enquiry, EnquiryStatus } from "@/lib/store/types";
import { buildEnquiryEmailBody, buildGmailComposeUrl } from "@/lib/gmail-compose";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { Mail, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES: EnquiryStatus[] = ["new", "contacted", "quoted", "won", "lost"];

type Props = {
  initialEnquiries: Enquiry[];
  contactEmail: string;
};

export function AdminInquiriesManager({ initialEnquiries, contactEmail }: Props) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selected, setSelected] = useState<string | null>(
    initialEnquiries[0]?.id ?? null,
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const active = enquiries.find((e) => e.id === selected);

  async function patch(id: string, data: Record<string, unknown>) {
    setSaving(true);
    setMessage("");
    const res = await secureJsonFetch("/api/admin/enquiries", {
      method: "PATCH",
      body: JSON.stringify({ id, ...data }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(json.error ?? "Update failed");
      return;
    }
    setEnquiries((prev) => prev.map((e) => (e.id === id ? json.enquiry : e)));
    setMessage("Saved.");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry permanently?")) return;
    const res = await secureJsonFetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMessage("Delete failed");
      return;
    }
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setSelected(null);
    router.refresh();
  }

  function openGmail(e: Enquiry) {
    const url = buildGmailComposeUrl({
      to: contactEmail,
      subject: `Re: ${e.service ?? "Enquiry"} — ${e.name}`,
      body: buildEnquiryEmailBody({
        name: e.name,
        email: e.email,
        phone: e.phone,
        service: e.service,
        message: e.message,
      }),
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function createOrderFromEnquiry(e: Enquiry) {
    const revenue = prompt("Quote amount in AUD (e.g. 5000):");
    if (!revenue) return;
    const cost = prompt("Estimated cost in AUD (optional, e.g. 3000):") ?? "0";
    const revenueCents = Math.round(parseFloat(revenue) * 100);
    const costCents = Math.round(parseFloat(cost) * 100);
    if (Number.isNaN(revenueCents)) return;

    const res = await secureJsonFetch("/api/admin/business", {
      method: "POST",
      body: JSON.stringify({
        type: "order",
        title: `${e.service ?? "Project"} — ${e.name}`,
        description: e.message,
        enquiryId: e.id,
        revenueCents,
        costCents,
        status: "quoted",
      }),
    });
    if (res.ok) {
      await patch(e.id, { status: "quoted", markRead: true });
      setMessage("Order created — see Business hub.");
    } else {
      setMessage("Could not create order");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="admin-card overflow-hidden rounded-2xl border border-ek-navy/10 bg-white">
        <div className="border-b border-ek-navy/8 px-4 py-3">
          <p className="text-xs font-bold tracking-wide text-ek-navy uppercase">
            {enquiries.length} enquiries
          </p>
        </div>
        <ul className="max-h-[520px] divide-y divide-ek-navy/8 overflow-y-auto">
          {enquiries.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(e.id);
                  if (!e.readAt) patch(e.id, { markRead: true });
                }}
                className={`w-full px-4 py-3 text-left transition hover:bg-ek-gray/40 ${
                  selected === e.id ? "bg-ek-teal/8" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ek-navy">{e.name}</p>
                    <p className="text-xs text-ek-muted">
                      {new Date(e.createdAt).toLocaleString("en-AU")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      e.status === "new"
                        ? "bg-ek-orange/15 text-ek-orange"
                        : "bg-ek-teal/10 text-ek-teal"
                    }`}
                  >
                    {e.status ?? "new"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-ek-muted">{e.message}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6">
        {!active ? (
          <p className="text-sm text-ek-muted">Select an enquiry to manage it.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-ek-navy">{active.name}</h2>
                <p className="text-sm text-ek-muted">{active.service ?? "General enquiry"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openGmail(active)}
                  className="rounded-lg bg-ek-teal px-3 py-2 text-[10px] font-bold tracking-wide text-white uppercase"
                >
                  Reply in Gmail
                </button>
                <button
                  type="button"
                  onClick={() => createOrderFromEnquiry(active)}
                  className="rounded-lg border border-ek-navy/15 px-3 py-2 text-[10px] font-bold tracking-wide text-ek-navy uppercase"
                >
                  Create quote
                </button>
                <button
                  type="button"
                  onClick={() => remove(active.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-[10px] font-bold text-red-700 uppercase"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a href={`mailto:${active.email}`} className="inline-flex items-center gap-2 text-ek-teal">
                <Mail className="h-4 w-4" />
                {active.email}
              </a>
              {active.phone && (
                <a href={`tel:${active.phone}`} className="inline-flex items-center gap-2 text-ek-navy">
                  <Phone className="h-4 w-4" />
                  {active.phone}
                </a>
              )}
            </div>

            <p className="mt-4 rounded-lg bg-ek-gray/50 p-4 text-sm leading-relaxed text-ek-muted">
              {active.message}
            </p>

            <label className="mt-4 block text-sm">
              <span className="font-semibold text-ek-navy">Status</span>
              <select
                className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2"
                value={active.status ?? "new"}
                disabled={saving}
                onChange={(ev) => patch(active.id, { status: ev.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-semibold text-ek-navy">Internal notes</span>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2"
                defaultValue={active.notes ?? ""}
                onBlur={(ev) => {
                  if (ev.target.value !== (active.notes ?? "")) {
                    patch(active.id, { notes: ev.target.value, markRead: true });
                  }
                }}
              />
            </label>

            {message && <p className="mt-3 text-sm text-ek-teal">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}
