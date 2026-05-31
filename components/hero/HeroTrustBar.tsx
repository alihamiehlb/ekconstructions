"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Award, Shield, ShieldCheck, TrendingUp } from "lucide-react";

type Props = {
  className?: string;
  variant?: "hero" | "default";
};

export function HeroTrustBar({ className = "", variant = "default" }: Props) {
  const site = useSite();
  const isHero = variant === "hero";

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
    <div className={`relative z-10 ${className}`.trim()}>
      <div
        className={`hero-trust-bar hero-trust-bar--mobile ${
          isHero ? "hero-trust-bar--hero" : ""
        } grid gap-2 px-2 py-2.5 sm:grid-cols-4 sm:gap-4 sm:px-6 sm:py-5 lg:grid-cols-4 ${
          isHero ? "grid-cols-4" : "grid-cols-2 gap-x-2.5 gap-y-3"
        }`}
      >
        {items.map(({ icon: Icon, label, sublabel }) => (
          <div
            key={label}
            className={
              isHero
                ? "hero-trust-item hero-trust-item--stack flex flex-col items-center gap-1.5 text-center lg:flex-row lg:items-center lg:gap-3 lg:text-left"
                : "flex items-start gap-1.5 sm:gap-3"
            }
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-full border border-ek-teal/25 bg-ek-teal/12 text-ek-teal ${
                isHero ? "h-7 w-7 lg:h-10 lg:w-10" : "h-7 w-7 sm:h-10 sm:w-10"
              }`}
            >
              <Icon
                className={
                  isHero ? "h-3.5 w-3.5 lg:h-[18px] lg:w-[18px]" : "h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]"
                }
                aria-hidden
              />
            </span>
            <div className={isHero ? "min-w-0" : "min-w-0 pt-0.5"}>
              <p
                className={`font-bold leading-snug text-white uppercase ${
                  isHero
                    ? "text-[7px] tracking-[0.03em] lg:text-[10px] lg:tracking-[0.06em]"
                    : "text-[7px] tracking-[0.03em] sm:text-[10px] sm:tracking-[0.06em]"
                }`}
              >
                {label}
              </p>
              {!isHero ? (
                <p className="mt-0.5 hidden text-[10px] leading-snug text-white/55 sm:block">
                  {sublabel}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
