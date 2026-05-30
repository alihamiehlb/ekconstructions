"use client";

import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { CmsService } from "@/lib/cms/types";
import { motion } from "framer-motion";

function WindowIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" aria-hidden>
      <rect x="4" y="6" width="24" height="20" stroke="white" strokeWidth="1.2" />
      <path d="M16 6v20M4 16h24" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

function BalustradeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" aria-hidden>
      <rect x="6" y="8" width="20" height="16" stroke="white" strokeWidth="1.2" />
      <path d="M6 24h20" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

function SteelIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" aria-hidden>
      <path d="M8 24V8l8-4 8 4v16" stroke="white" strokeWidth="1.2" />
      <path d="M8 8h16M8 16h16" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

function FenceIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" aria-hidden>
      <path d="M6 24V10M12 24V10M18 24V10M24 24V10" stroke="white" strokeWidth="1.2" />
      <path d="M5 10h22M5 17h22" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

function HammerIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" fill="none" aria-hidden>
      <path d="M8 24l8-8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 10l8 8-4 4-8-8 4-4z" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

const icons = {
  window: WindowIcon,
  balustrade: BalustradeIcon,
  steel: SteelIcon,
  fence: FenceIcon,
  hammer: HammerIcon,
} as const;

export function Services({ services }: { services: CmsService[] }) {
  return (
    <section id="services" className="relative z-20 mt-2 sm:mt-0 lg:-mt-8">
      <div className="services-clip bg-ek-navy pb-10 pt-[4.5rem] sm:pb-11 sm:pt-20 md:pb-12 md:pt-[5.5rem] lg:pt-24">
        <div className="landing-container">
          <SectionReveal>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-ek-teal uppercase">
              What we build
            </p>
            <h2 className="mt-1 text-lg font-black tracking-[0.22em] text-white uppercase sm:text-xl">
              Services
            </h2>
          </SectionReveal>

          <StaggerReveal className="mt-6 grid grid-cols-2 gap-x-2 gap-y-7 sm:mt-7 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-5 lg:gap-3">
            {services.map((service) => {
              const Icon = icons[service.icon as keyof typeof icons] ?? WindowIcon;
              return (
                <StaggerItem key={service.id}>
                  <motion.article
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="rounded-full p-2 transition-colors hover:bg-white/5">
                      <Icon />
                    </div>
                    <h3 className="mt-3 max-w-[8.75rem] text-[9px] leading-[1.35] font-bold tracking-[0.06em] text-white uppercase sm:text-[10px]">
                      {service.title}
                    </h3>
                    <p className="mt-2 hidden max-w-[11rem] text-[9px] leading-snug text-white/55 sm:block lg:max-w-[9.5rem]">
                      {service.description}
                    </p>
                  </motion.article>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
