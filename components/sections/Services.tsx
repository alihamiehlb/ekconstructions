"use client";

import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { CmsService } from "@/lib/cms/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconClass = "h-6 w-6 text-ek-teal sm:h-9 sm:w-9";

function WindowIcon() {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden>
      <rect x="5" y="7" width="22" height="18" stroke="currentColor" strokeWidth="1.25" />
      <path d="M16 7v18M5 16h22" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function BalustradeIcon() {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden>
      <rect x="6" y="6" width="20" height="20" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 24L22 8" stroke="currentColor" strokeWidth="1.25" />
      <path d="M14 24L26 8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function SteelIcon() {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden>
      <path
        d="M8 24V13l8-6 8 6v11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M8 13h16" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function FenceIcon() {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden>
      <path
        d="M8 24V8M12 24V8M16 24V8M20 24V8M24 24V8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HammerIcon() {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden>
      <path
        d="M9 23l10-10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M15 9l8 8-3 3-8-8 3-3z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
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
    <section id="services" className="relative overflow-hidden bg-ek-navy">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <Image
          src="/images/hero-building.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative pb-8 pt-6 sm:pb-14 sm:pt-12 md:pb-16 md:pt-14 lg:pt-16">
        <div className="landing-container">
          <SectionReveal>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <p className="text-[9px] font-semibold tracking-[0.24em] text-ek-teal uppercase sm:text-[10px] sm:tracking-[0.28em]">
                Our Expertise
              </p>
              <span className="h-px max-w-16 flex-1 bg-ek-teal/80 sm:max-w-32" aria-hidden />
            </div>
            <h2 className="mt-1.5 text-xl font-black tracking-[0.16em] text-white uppercase sm:mt-2 sm:text-3xl sm:tracking-[0.18em]">
              Services
            </h2>
          </SectionReveal>

          <StaggerReveal className="mt-5 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-4 lg:grid-cols-5 lg:gap-3">
            {services.map((service, index) => {
              const Icon = icons[service.icon as keyof typeof icons] ?? WindowIcon;
              const isLastCentered = index === services.length - 1 && services.length % 2 === 1;

              return (
                <StaggerItem
                  key={service.id}
                  className={
                    isLastCentered
                      ? "col-span-2 mx-auto w-full max-w-[calc(50%-0.25rem)] lg:col-span-1 lg:mx-0 lg:max-w-none"
                      : ""
                  }
                >
                  <Link
                    href="#contact"
                    className="group relative flex min-h-[7.5rem] flex-col border border-white/10 bg-ek-navy/40 p-3.5 transition hover:border-white/24 hover:bg-white/[0.03] sm:min-h-[180px] sm:p-6"
                  >
                    <Icon />
                    <h3 className="mt-2.5 text-[9px] font-bold leading-snug tracking-[0.06em] text-white uppercase sm:mt-4 sm:max-w-[16rem] sm:text-xs sm:tracking-[0.08em]">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 hidden flex-1 text-[12px] leading-relaxed text-white/55 sm:mt-2 sm:block sm:max-w-[18rem] sm:text-[13px]">
                      {service.description}
                    </p>
                    <ArrowRight
                      className="absolute right-2.5 bottom-2.5 h-3 w-3 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white sm:right-5 sm:bottom-5 sm:h-4 sm:w-4"
                      aria-hidden
                    />
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
