"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function About() {
  const site = useSite();

  return (
    <section id="about" className="section-block bg-ek-surface" aria-labelledby="about-heading">
      <div className="landing-container grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start lg:gap-16">
        <div className="max-w-3xl">
          <SectionHeading id="about-heading" eyebrow="About" title={`About ${site.name}`} />

          <div className="about-accent-panel mt-8 space-y-5 text-sm leading-relaxed text-ek-muted sm:text-base lg:mt-10">
            {site.aboutParagraphs.map((p: string, i: number) => (
              <SectionReveal key={i} delay={0.08 + i * 0.06}>
                <p>{p}</p>
              </SectionReveal>
            ))}
          </div>
        </div>

        <SectionReveal delay={0.15}>
          <aside className="rounded-xl border border-ek-navy/8 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(10,10,10,0.2)]">
            <p className="section-eyebrow section-eyebrow--light text-[9px]">Credentials</p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-[10px] font-bold tracking-[0.12em] text-ek-muted uppercase">
                  Experience
                </dt>
                <dd className="mt-1 text-2xl font-black text-ek-navy">
                  {site.business.yearsExperience}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-[0.12em] text-ek-muted uppercase">
                  Projects
                </dt>
                <dd className="mt-1 text-2xl font-black text-ek-navy">
                  {site.business.projectsDelivered}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-[0.12em] text-ek-muted uppercase">
                  Established
                </dt>
                <dd className="mt-1 text-lg font-bold text-ek-navy">{site.business.memberSince}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-[0.12em] text-ek-muted uppercase">
                  ABN
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ek-navy">{site.business.abn}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-ek-muted">
              Serving {site.location.area} and Greater NSW.
            </p>
          </aside>
        </SectionReveal>
      </div>
    </section>
  );
}
