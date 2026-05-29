"use client";

import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

type Props = {
  sessionConfigured: boolean;
  siteUrl: string;
};

export function AdminSettingsPanel({ sessionConfigured, siteUrl }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const steps = [
    "Open Chrome and log into instagram.com with the business account.",
    "Press F12 → Application tab → Cookies → https://www.instagram.com",
    "Find the cookie named sessionid and copy its Value (long random string).",
    "Optional: also copy ig_did for better reliability.",
    "In Vercel → your project → Settings → Environment Variables, add:",
    "INSTAGRAM_SESSION_ID = paste sessionid value",
    "INSTAGRAM_IG_DID = paste ig_did value (optional)",
    "Redeploy the site (Deployments → Redeploy).",
  ];

  return (
    <div className="space-y-8">
      <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
            Instagram session
          </h2>
          {sessionConfigured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ek-teal/10 px-2 py-0.5 text-[10px] font-bold text-ek-teal uppercase">
              <CheckCircle2 className="h-3 w-3" />
              Configured
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
              Not set
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ek-muted">
          The session ID lets the server discover posts and read captions when Instagram blocks
          anonymous access. Without it, you can still paste individual post URLs manually.
        </p>

        <ol className="mt-5 space-y-3 text-sm text-ek-navy">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ek-teal/10 text-xs font-bold text-ek-teal">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["INSTAGRAM_SESSION_ID", "sessionid cookie value"],
            ["INSTAGRAM_IG_DID", "ig_did cookie (optional)"],
          ].map(([name, hint]) => (
            <div
              key={name}
              className="rounded-xl border border-ek-navy/10 bg-ek-gray/30 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-semibold text-ek-navy">{name}</code>
                <button
                  type="button"
                  onClick={() => copy(name, name)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-ek-teal uppercase"
                >
                  {copied === name ? "Copied" : "Copy name"}
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-xs text-ek-muted">{hint}</p>
            </div>
          ))}
        </div>

        <a
          href="https://vercel.com/docs/projects/environment-variables"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-ek-teal uppercase"
        >
          Vercel env docs
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Site URL</h2>
        <p className="mt-2 text-sm text-ek-muted">
          Used for CSRF/origin checks and metadata. Set{" "}
          <code className="rounded bg-ek-gray px-1">NEXT_PUBLIC_SITE_URL</code> in Vercel.
        </p>
        <p className="mt-3 font-mono text-sm text-ek-navy">{siteUrl}</p>
      </section>
    </div>
  );
}
