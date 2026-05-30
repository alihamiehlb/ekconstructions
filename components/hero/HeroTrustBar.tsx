"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Award, Shield, ShieldCheck, TrendingUp } from "lucide-react";

type Props = {
  className?: string;
};

export function HeroTrustBar({ className = "" }: Props) {
  const site = useSite();

  const items = [
    {
      icon: Shield,
      label: `${site.business.yearsExperience} Years Experience`,
      sublabel: "Built on trust & quality",
    },
    {
      icon: TrendingUp,
      label: `${site.business.projectsDelivered} Projects Delivered`,
      sublabel: "Across Sydney & NSW",
    },
    {
      icon: Award,
      label: "Fully Licensed & Insured",
      sublabel: "Peace of mind guaranteed",
    },
    {
      icon: ShieldCheck,
      label: "Australian Standards Compliant",
      sublabel: "Committed to safety",
    },
  ];

  return (
    <div className={`relative z-10 mt-8 lg:mt-12 ${className}`.trim()}>
      <div className="hero-trust-bar hero-trust-bar--mobile grid grid-cols-2 gap-x-3 gap-y-4 px-3 py-4 sm:grid-cols-4 sm:gap-4 sm:px-6 sm:py-5 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, sublabel }) => (
          <div key={label} className="flex items-start gap-2.5 sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ek-teal/15 text-ek-teal sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[8px] font-bold leading-snug tracking-[0.04em] text-white uppercase sm:text-[10px] sm:tracking-[0.06em]">
                {label}
              </p>
              <p className="mt-0.5 text-[8px] leading-snug text-white/55 sm:text-[10px]">
                {sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
