"use client";

import type { Enquiry } from "@/lib/store/types";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

type Props = {
  enquiries: Enquiry[];
};

export function AdminEnquiriesPanel({ enquiries }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (enquiries.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-ek-muted">
        No enquiries yet. Submit the contact form on the site to test.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ek-navy/8">
      {enquiries.map((e) => {
        const open = expanded === e.id;
        return (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setExpanded(open ? null : e.id)}
              className="flex w-full flex-col gap-2 px-6 py-4 text-left transition hover:bg-ek-gray/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ek-navy">{e.name}</p>
                <p className="text-xs text-ek-muted">
                  {new Date(e.createdAt).toLocaleString("en-AU")}
                  {e.service ? ` · ${e.service}` : ""}
                </p>
              </div>
              <p className="truncate text-sm text-ek-muted sm:max-w-md">{e.message}</p>
            </button>
            {open && (
              <div className="border-t border-ek-navy/5 bg-ek-gray/25 px-6 py-4 text-sm">
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${e.email}`}
                    className="inline-flex items-center gap-2 font-medium text-ek-teal hover:underline"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    {e.email}
                  </a>
                  {e.phone && (
                    <a
                      href={`tel:${e.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 text-ek-navy hover:text-ek-teal"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {e.phone}
                    </a>
                  )}
                </div>
                <p className="mt-4 flex gap-2 leading-relaxed text-ek-muted">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-ek-teal" aria-hidden />
                  {e.message}
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
