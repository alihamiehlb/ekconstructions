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
    <div className="relative z-10 mt-8 sm:mt-10 lg:mt-12">
      <div className="hero-trust-bar grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 sm:grid-cols-4 sm:gap-4 sm:px-6 sm:py-5">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-start gap-2.5 sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ek-teal/15 text-ek-teal sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
            </span>
            <p className="pt-1 text-[9px] font-bold leading-snug tracking-[0.06em] text-white uppercase sm:text-[10px]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
