"use client";

import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import type { CmsWhyItem } from "@/lib/cms/types";
import { motion, useReducedMotion } from "framer-motion";

export function WhyChooseUs({
  items,
}: {
  items: CmsWhyItem[];
  projectsDelivered?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-block-light">
      <div className="landing-container">
        <SectionHeading
          title="Why Choose Us?"
          description="Trusted expertise, quality materials, and a commitment to Australian standards on every project."
        />

        <StaggerReveal className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ek-gray text-ek-navy transition-colors duration-300 group-hover:bg-ek-teal/10">
                  <ServiceIcon name={item.icon} className="h-8 w-8" />
                </div>
                <h3 className="max-w-[9rem] text-[11px] leading-snug font-bold tracking-[0.06em] text-ek-navy uppercase sm:text-xs lg:max-w-[10rem]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[11rem] text-xs leading-relaxed text-ek-muted sm:text-[13px] lg:max-w-[9.5rem]">
                  {item.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
