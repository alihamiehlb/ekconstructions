"use client";

import { services } from "@/content/site";
import { useSite } from "@/components/providers/SiteProvider";
import { isContactFormReady, readContactFields } from "@/lib/contact-form";
import { buildEnquiryEmailBody, buildGmailComposeUrl } from "@/lib/gmail-compose";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useCallback, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const site = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [gmailFallbackUrl, setGmailFallbackUrl] = useState<string | null>(null);

  const syncReady = useCallback((form: HTMLFormElement | null) => {
    if (!form) return;
    const fields = readContactFields(form);
    setCanSubmit(isContactFormReady(fields));
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = readContactFields(form);
    if (!isContactFormReady(payload)) {
      return;
    }

    const toEmail = site.contact.email || "hello@ekconstructions.com.au";
    const gmailUrl = buildGmailComposeUrl({
      to: toEmail,
      subject: `Website enquiry — ${payload.name.trim()}${payload.service ? ` (${payload.service})` : ""}`,
      body: buildEnquiryEmailBody({
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || undefined,
        service: payload.service || undefined,
        message: payload.message.trim(),
      }),
    });

    setGmailFallbackUrl(gmailUrl);
    const opened = window.open(gmailUrl, "_blank", "noopener,noreferrer");
    if (!opened) {
      setError("");
    }

    void (async () => {
      setStatus("loading");
      setError("");

      try {
        const res = await secureJsonFetch("/api/contact", {
          method: "POST",
          body: JSON.stringify({
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone: payload.phone?.trim() || undefined,
            service: payload.service || undefined,
            message: payload.message.trim(),
          }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(json.error ?? "Something went wrong. Please try again.");
          setStatus("error");
          return;
        }

        setStatus("success");
        form.reset();
        setCanSubmit(false);
      } catch {
        setError("Network error. Please check your connection and try again.");
        setStatus("error");
      }
    })();
  }

  const submitDisabled = status === "loading" || !canSubmit;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
      onInput={(e) => syncReady(e.currentTarget)}
      onChange={(e) => syncReady(e.currentTarget)}
      ref={(el) => syncReady(el)}
    >
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
            minLength={2}
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="tel"
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
            <option value="">Select a service (optional)</option>
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
          minLength={10}
          rows={5}
          placeholder="Tell us about your location, timeline, and what you need..."
          className="w-full resize-y rounded-lg border border-ek-navy/15 bg-white px-4 py-3 outline-none transition focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
        />
        <p className="mt-1 text-xs text-ek-muted">At least 10 characters.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {status === "success" && (
        <div
          className="rounded-lg border border-ek-teal/25 bg-ek-teal/5 px-4 py-3 text-sm text-ek-navy"
          role="status"
          aria-live="polite"
        >
          <p className="font-medium">Thank you — your enquiry was saved.</p>
          <p className="mt-1 text-ek-muted">
            Gmail should have opened with your message addressed to{" "}
            <span className="font-semibold text-ek-navy">{site.contact.email}</span>. Click send
            there to deliver it.
          </p>
          {gmailFallbackUrl && (
            <a
              href={gmailFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-ek-teal underline"
            >
              Open Gmail compose
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={submitDisabled}
        aria-disabled={submitDisabled}
        className="w-full rounded-full bg-ek-teal px-8 py-4 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-ek-teal-dark disabled:cursor-not-allowed disabled:bg-ek-navy/25 disabled:text-white/70 sm:w-auto"
      >
        {status === "loading" ? "Saving…" : "Send enquiry & open Gmail"}
      </button>
      {!canSubmit && status !== "loading" && (
        <p className="text-xs text-ek-muted">Fill in name, email, and project details to continue.</p>
      )}

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
