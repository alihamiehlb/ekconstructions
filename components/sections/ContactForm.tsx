"use client";

import { services } from "@/content/site";
import { useSite } from "@/components/providers/SiteProvider";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const site = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await secureJsonFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ek-navy">
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-ek-navy/15 bg-white px-4 py-3 outline-none transition focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ek-navy">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-ek-navy/15 bg-white px-4 py-3 outline-none transition focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ek-navy">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-lg border border-ek-navy/15 bg-white px-4 py-3 outline-none transition focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
          />
        </div>
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-ek-navy">
            Service
          </label>
          <select
            id="service"
            name="service"
            className="w-full rounded-lg border border-ek-navy/15 bg-white px-4 py-3 outline-none transition focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
            defaultValue=""
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ek-navy">
          Project details *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your location, timeline, and what you need..."
          className="w-full resize-y rounded-lg border border-ek-navy/15 bg-white px-4 py-3 outline-none transition focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {status === "success" && (
        <div
          className="rounded-lg border border-ek-teal/25 bg-ek-teal/5 px-4 py-3 text-sm font-medium text-ek-navy"
          role="status"
          aria-live="polite"
        >
          Thank you — we&apos;ll be in touch shortly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ek-teal px-8 py-4 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-ek-teal-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>

      <p className="text-xs leading-relaxed text-ek-muted">
        By submitting, you agree to our{" "}
        <a href="/privacy" className="underline hover:text-ek-teal">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/cookies" className="underline hover:text-ek-teal">
          Cookie Policy
        </a>
        .
      </p>

      {site.contact.phone && (
        <p className="text-sm text-ek-muted">
          Or call{" "}
          <a href={`tel:${site.contact.phone}`} className="font-semibold text-ek-teal">
            {site.contact.phone}
          </a>
        </p>
      )}
    </form>
  );
}
