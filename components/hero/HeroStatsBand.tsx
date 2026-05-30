"use client";

import { useSite } from "@/components/providers/SiteProvider";

export function HeroStatsBand() {
  const site = useSite();

  const stats = [
    { value: site.business.yearsExperience, label: "Years Experience" },
    { value: site.business.projectsDelivered, label: "Projects Delivered" },
    { value: "100%", label: "Quality Focused" },
    { value: "Sydney", label: "& Greater NSW" },
  ];

  return (
    <div className="relative z-20 bg-white py-8 sm:py-10">
      <div className="landing-container">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-[1.75rem] font-black leading-none text-ek-teal sm:text-[2rem] lg:text-[2.15rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[9px] font-bold tracking-[0.12em] text-ek-navy uppercase sm:text-[10px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
