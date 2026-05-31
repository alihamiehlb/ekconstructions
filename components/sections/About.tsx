"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function About() {
  const site = useSite();

  return (
    <section id="about" className="section-block section-block-muted">
      <div className="landing-container max-w-3xl">
        <SectionHeading title={`About ${site.name}`} />

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-ek-muted sm:text-base lg:mt-10">
          {site.aboutParagraphs.map((p: string, i: number) => (
            <SectionReveal key={i} delay={0.08 + i * 0.06}>
              <p>{p}</p>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal delay={0.3}>
          <p className="mt-10 text-xs font-semibold tracking-wide text-ek-navy/70 uppercase lg:text-sm">
            ABN {site.business.abn} · Serving {site.location.area} ·{" "}
            {site.business.yearsExperience} years experience · Est. {site.business.memberSince}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
