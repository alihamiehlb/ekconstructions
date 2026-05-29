import type { CmsService } from "@/lib/cms/types";

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
    <section id="services" className="relative z-20 -mt-2 sm:-mt-4 md:-mt-6 lg:-mt-10">
      <div className="services-clip bg-ek-navy pb-10 pt-12 sm:pb-11 sm:pt-14 md:pb-12 md:pt-16">
        <div className="landing-container">
          <p className="text-[10px] font-semibold tracking-[0.38em] text-white/50 uppercase">
            Our Services
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-7 sm:mt-7 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-5 lg:gap-3">
            {services.map((service) => {
              const Icon = icons[service.icon as keyof typeof icons] ?? WindowIcon;
              return (
                <article key={service.id} className="flex flex-col items-center text-center">
                  <Icon />
                  <h3 className="mt-3 max-w-[8.75rem] text-[9px] leading-[1.35] font-bold tracking-[0.06em] text-white uppercase sm:text-[10px]">
                    {service.title}
                  </h3>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
