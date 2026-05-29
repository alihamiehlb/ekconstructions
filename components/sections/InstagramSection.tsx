"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Instagram } from "lucide-react";
import Link from "next/link";

export function InstagramSection() {
  const site = useSite();

  return (
    <section className="section-pad border-t border-ek-navy/8 bg-ek-gray/40 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <SectionReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-ek-teal/20 bg-white px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-ek-teal uppercase">
            <Instagram className="h-3.5 w-3.5" aria-hidden />
            Follow us
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-ek-navy uppercase md:text-3xl">
            Latest on Instagram
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ek-muted">
            Real project photos from{" "}
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ek-teal hover:underline"
            >
              @{site.instagram.handle}
            </a>
            . Follow for new installs, before-and-after shots, and Sydney project updates.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.12} className="mt-8">
          <div className="overflow-hidden rounded-xl border border-ek-navy/10 bg-white p-8 shadow-sm md:p-10">
            <p className="text-sm text-ek-muted">
              Save your favourite posts from Instagram into{" "}
              <code className="rounded bg-ek-gray px-1.5 py-0.5 text-xs">public/instagram/</code>{" "}
              to update the site gallery automatically.
            </p>
            <Link
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 inline-flex"
            >
              View @{site.instagram.handle}
              <Instagram className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
