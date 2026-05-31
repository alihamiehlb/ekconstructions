"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";

export function Materials({ materials }: { materials: string[] }) {
  return (
    <section id="materials" className="section-block-light">
      <div className="landing-container">
        <SectionHeading
          title="Materials & Standards"
          description="We specify proven systems and compliant fixings for long-lasting results."
        />
        <StaggerReveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {materials.map((item) => (
            <StaggerItem key={item}>
              <div className="material-card group flex items-start gap-3 rounded-lg border border-ek-navy/8 bg-ek-gray/40 px-4 py-3.5 text-sm text-ek-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-ek-teal/25 hover:bg-white hover:shadow-[0_12px_32px_-20px_rgba(10,10,10,0.25)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ek-teal transition-transform duration-300 group-hover:scale-125" />
                {item}
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
