"use client";

import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import type { CmsWhyItem } from "@/lib/cms/types";
import { useReducedMotion } from "framer-motion";

export function WhyChooseUs({
  items,
  projectsDelivered,
  yearsExperience,
}: {
  items: CmsWhyItem[];
  projectsDelivered?: string;
  yearsExperience?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-block-light" aria-labelledby="why-heading">
      <div className="landing-container">
        <SectionHeading
          id="why-heading"
          eyebrow="Why EK"
          title="Why Choose Us?"
          description="Trusted expertise, quality materials, and a commitment to Australian standards on every project."
        />

        {(projectsDelivered || yearsExperience) && (
          <div className="why-stat-band mt-10">
            {yearsExperience ? (
              <div className="why-stat-cell">
                <p className="why-stat-value">{yearsExperience}</p>
                <p className="why-stat-label">Years experience</p>
              </div>
            ) : null}
            {projectsDelivered ? (
              <div className="why-stat-cell">
                <p className="why-stat-value">{projectsDelivered}</p>
                <p className="why-stat-label">Projects delivered</p>
              </div>
            ) : null}
            <div className="why-stat-cell">
              <p className="why-stat-value">100%</p>
              <p className="why-stat-label">Licensed & insured</p>
            </div>
          </div>
        )}

        <StaggerReveal className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <div
                className={`why-value-card flex h-full flex-col items-center text-center ${
                  reduceMotion ? "" : ""
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-ek-navy/8 bg-ek-gray text-ek-navy">
                  <ServiceIcon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-[11px] font-bold leading-snug tracking-[0.06em] text-ek-navy uppercase sm:text-xs">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ek-muted sm:text-[13px]">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
