"use client";

import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import type { CmsWhyItem } from "@/lib/cms/types";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function WhyChooseUs({
  items,
}: {
  items: CmsWhyItem[];
  projectsDelivered?: string;
}) {
  return (
    <section className="bg-white py-10 md:py-12 lg:py-14">
      <div className="landing-container">
        <SectionReveal>
          <h2 className="text-[1.45rem] font-black tracking-tight text-ek-navy uppercase sm:text-[1.65rem] lg:text-[1.85rem]">
            Why Choose Us?
          </h2>
        </SectionReveal>

        <StaggerReveal className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-ek-gray text-ek-navy transition-colors hover:bg-ek-teal/10">
                  <ServiceIcon name={item.icon} className="h-8 w-8" />
                </div>
                <h3 className="max-w-[7.5rem] text-[9px] leading-[1.35] font-bold tracking-[0.05em] text-ek-navy uppercase sm:text-[10px]">
                  {item.title}
                </h3>
                <p className="mt-2 hidden max-w-[9rem] text-[8px] leading-snug text-ek-muted sm:block lg:max-w-[7.5rem]">
                  {item.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-8 flex justify-center lg:justify-start">
            <Link href="/gallery" className="btn-primary inline-flex shadow-sm">
              View Our Work
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
