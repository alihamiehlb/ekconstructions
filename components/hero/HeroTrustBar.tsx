"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Award, Shield, ShieldCheck, TrendingUp } from "lucide-react";

export function HeroTrustBar() {
  const site = useSite();

  const items = [
    {
      icon: Shield,
      label: `${site.business.yearsExperience} Years Experience`,
    },
    {
      icon: TrendingUp,
      label: `${site.business.projectsDelivered} Projects Delivered`,
    },
    {
      icon: Award,
      label: "Fully Licensed & Insured",
    },
    {
      icon: ShieldCheck,
      label: "Australian Standards Compliant",
    },
  ];

  return (
    <div className="relative z-10 mt-auto pt-4 lg:mt-12">
      <div className="hero-trust-bar hero-trust-bar--mobile grid grid-cols-4 gap-1 px-2 py-3 sm:grid-cols-4 sm:gap-4 sm:px-6 sm:py-5 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ek-teal/15 text-ek-teal sm:h-10 sm:w-10">
              <Icon className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" aria-hidden />
            </span>
            <p className="text-[7px] font-bold leading-snug tracking-[0.04em] text-white uppercase sm:pt-1 sm:text-[10px] sm:tracking-[0.06em]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
