import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CmsService } from "@/lib/cms/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const iconClass = "h-7 w-7 text-ek-teal sm:h-8 sm:w-8";

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
      <path d="M9 23l10-10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
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
    <section
      id="services"
      className="section-block services-section-v2 scroll-mt-20 py-12 md:py-16 lg:scroll-mt-[5.5rem] lg:py-20"
      aria-labelledby="services-heading"
    >
      <div className="landing-container">
        <SectionHeading
          id="services-heading"
          eyebrow="Our Expertise"
          title="Services"
          description="Premium aluminium, glass, steel and carpentry — designed, supplied and installed with precision across Sydney and Greater NSW."
          theme="dark"
        />

        <StaggerReveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {services.map((service, index) => {
            const Icon = icons[service.icon as keyof typeof icons] ?? WindowIcon;
            const isLastOdd =
              index === services.length - 1 && services.length % 2 === 1;

            return (
              <StaggerItem
                key={service.id}
                className={isLastOdd ? "sm:col-span-2 sm:max-w-md sm:justify-self-center lg:col-span-1 lg:max-w-none" : ""}
              >
                <Link href="#contact" className="service-card-v2 group">
                  <span className="service-card-v2-index" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="service-card-v2-icon">
                    <Icon />
                  </span>
                  <h3 className="mt-4 text-sm font-bold tracking-wide uppercase">{service.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase group-hover:text-white">
                    Enquire
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
