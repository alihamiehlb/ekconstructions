"use client";

import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  siteUrl: string;
};

export function AdminSettingsPanel({ siteUrl }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-8">
      <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Gallery images</h2>
        <p className="mt-3 text-sm leading-relaxed text-ek-muted">
          Add projects in{" "}
          <Link href="/admin/projects" className="font-semibold text-ek-teal hover:underline">
            Admin → Gallery
          </Link>
          . Paste direct image URLs (Supabase Storage, CDN, or paths like{" "}
          <code className="rounded bg-ek-gray px-1">/images/...</code>). Optional file upload stores
          images in Supabase when configured.
        </p>
      </section>

      <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Site URL</h2>
        <p className="mt-2 text-sm text-ek-muted">
          Used for CSRF/origin checks and metadata. Set{" "}
          <code className="rounded bg-ek-gray px-1">NEXT_PUBLIC_SITE_URL</code> in Vercel.
        </p>
        <p className="mt-3 font-mono text-sm text-ek-navy">{siteUrl}</p>
        <button
          type="button"
          onClick={() => copy(siteUrl, "siteUrl")}
          className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-ek-teal uppercase"
        >
          {copied === "siteUrl" ? "Copied" : "Copy URL"}
          <Copy className="h-3 w-3" />
        </button>
      </section>

      <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
            Environment variables
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-ek-teal/10 px-2 py-0.5 text-[10px] font-bold text-ek-teal uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Production
          </span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-ek-muted">
          <li>
            <code className="text-ek-navy">ADMIN_SECRET</code> — JWT signing (min 32 chars)
          </li>
          <li>
            <code className="text-ek-navy">ADMIN_PASSWORD</code> — Admin login password
          </li>
          <li>
            <code className="text-ek-navy">NEXT_PUBLIC_SUPABASE_URL</code> — Database + storage
          </li>
          <li>
            <code className="text-ek-navy">SUPABASE_SERVICE_ROLE_KEY</code> — Server-side CMS writes
          </li>
        </ul>
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
    </div>
  );
}
