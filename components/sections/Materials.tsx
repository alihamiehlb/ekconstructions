"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";

export function Materials({ materials }: { materials: string[] }) {
  return (
    <section id="materials" className="bg-white py-14 md:py-16">
      <div className="landing-container">
        <SectionReveal>
          <h2 className="text-2xl font-black tracking-tight text-ek-navy uppercase sm:text-3xl">
            Materials & Standards
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ek-muted">
            We specify proven systems and compliant fixings for long-lasting results.
          </p>
        </SectionReveal>
        <StaggerReveal className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((item) => (
            <StaggerItem key={item}>
              <li className="flex list-none items-start gap-3 rounded-lg border border-ek-navy/8 bg-ek-gray/40 px-4 py-3 text-sm text-ek-navy transition-colors hover:border-ek-teal/25 hover:bg-white">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ek-teal" />
                {item}
              </li>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
