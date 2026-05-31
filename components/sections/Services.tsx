"use client";

import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { CmsService } from "@/lib/cms/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconClass = "h-7 w-7 text-ek-teal sm:h-8 sm:w-8 lg:h-9 lg:w-9";

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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ek-navy via-ek-navy/98 to-ek-navy" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden>
        <Image
          src="/images/hero-building.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative pb-10 pt-8 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16">
        <div className="landing-container">
          <SectionReveal>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <p className="text-[9px] font-semibold tracking-[0.24em] text-ek-teal uppercase sm:text-[10px] sm:tracking-[0.28em]">
                  Our Expertise
                </p>
                <span className="h-px max-w-16 flex-1 bg-ek-teal/80 sm:max-w-32" aria-hidden />
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-[0.14em] text-white uppercase sm:text-3xl lg:text-4xl lg:tracking-[0.16em]">
                Services
              </h2>
              <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/55 lg:block">
                Premium aluminium, glass, steel and carpentry — designed, supplied and installed with
                precision across Sydney and Greater NSW.
              </p>
            </div>
          </SectionReveal>

          <StaggerReveal className="services-grid mt-8 sm:mt-10 lg:mt-12">
            {services.map((service, index) => {
              const Icon = icons[service.icon as keyof typeof icons] ?? WindowIcon;
              const isLastOdd =
                index === services.length - 1 && services.length % 2 === 1;

              return (
                <StaggerItem
                  key={service.id}
                  className={
                    isLastOdd
                      ? "sm:col-span-2 sm:max-w-xl sm:justify-self-center xl:col-span-1 xl:max-w-none xl:justify-self-auto"
                      : ""
                  }
                >
                  <Link href="#contact" className="service-card group">
                    <span className="service-card-accent" aria-hidden />
                    <Icon />
                    <h3 className="mt-4 text-[10px] font-bold leading-snug tracking-[0.08em] text-white uppercase sm:text-xs lg:text-[13px]">
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[12px] leading-relaxed text-white/55 sm:text-[13px] lg:text-sm lg:leading-[1.65]">
                      {service.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-white/70 uppercase transition group-hover:text-ek-teal">
                      Enquire
                      <ArrowRight
                        className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
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
