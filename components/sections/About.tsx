"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function About() {
  const site = useSite();

  return (
    <section id="about" className="bg-ek-gray py-14 md:py-16 lg:py-20">
      <div className="landing-container max-w-3xl">
        <SectionReveal>
          <h2 className="text-2xl font-black tracking-tight text-ek-navy uppercase sm:text-3xl">
            About {site.name}
          </h2>
        </SectionReveal>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ek-muted sm:text-base">
          {site.aboutParagraphs.map((p: string, i: number) => (
            <SectionReveal key={i} delay={0.1 + i * 0.08}>
              <p>{p}</p>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal delay={0.35}>
          <p className="mt-8 text-xs font-semibold tracking-wide text-ek-navy/70 uppercase">
            ABN {site.business.abn} · Serving {site.location.area} ·{" "}
            {site.business.yearsExperience} years experience · Est. {site.business.memberSince}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
