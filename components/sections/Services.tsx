"use client";

import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { CmsService } from "@/lib/cms/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconClass = "h-8 w-8 text-ek-teal sm:h-9 sm:w-9";

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

      <div className="relative pb-12 pt-10 sm:pb-14 sm:pt-12 md:pb-16 md:pt-14 lg:pt-16">
        <div className="landing-container">
          <SectionReveal>
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-ek-teal uppercase">
                Our Expertise
              </p>
              <span className="h-px max-w-24 flex-1 bg-ek-teal/80 sm:max-w-32" aria-hidden />
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-[0.18em] text-white uppercase sm:text-3xl">
              Services
            </h2>
          </SectionReveal>

          <StaggerReveal className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:gap-5">
            {services.map((service, index) => {
              const Icon = icons[service.icon as keyof typeof icons] ?? WindowIcon;
              const isLastCentered = index === services.length - 1 && services.length % 2 === 1;

              return (
                <StaggerItem
                  key={service.id}
                  className={isLastCentered ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-0.5rem)]" : ""}
                >
                  <Link
                    href="#contact"
                    className="group relative flex min-h-[168px] flex-col border border-white/12 bg-ek-navy/40 p-5 transition hover:border-white/28 hover:bg-white/[0.03] sm:min-h-[180px] sm:p-6"
                  >
                    <Icon />
                    <h3 className="mt-4 max-w-[16rem] text-[11px] font-bold leading-snug tracking-[0.08em] text-white uppercase sm:text-xs">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-[18rem] flex-1 text-[12px] leading-relaxed text-white/55 sm:text-[13px]">
                      {service.description}
                    </p>
                    <ArrowRight
                      className="absolute right-4 bottom-4 h-4 w-4 text-white/70 transition group-hover:translate-x-0.5 group-hover:text-white sm:right-5 sm:bottom-5"
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
