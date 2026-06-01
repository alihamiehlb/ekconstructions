"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Award, Shield, ShieldCheck, TrendingUp } from "lucide-react";

type Props = {
  className?: string;
  variant?: "hero" | "default" | "inline";
};

export function HeroTrustBar({ className = "", variant = "default" }: Props) {
  const site = useSite();
  const isHero = variant === "hero";

  const items = [
    {
      icon: Shield,
      label: `${site.business.yearsExperience} Years`,
      sublabel: "Experience",
    },
    {
      icon: TrendingUp,
      label: site.business.projectsDelivered,
      sublabel: "Projects",
    },
    {
      icon: Award,
      label: "Licensed",
      sublabel: "& insured",
    },
    {
      icon: ShieldCheck,
      label: "Australian",
      sublabel: "Standards",
    },
  ];

  return (
    <div className={className}>
      <div
        className={
          isHero
            ? "hero-trust-pro grid grid-cols-2 gap-3 sm:grid-cols-4"
            : "hero-trust-bar grid grid-cols-2 gap-3 rounded-lg border border-ek-line bg-ek-gray p-4 sm:grid-cols-4"
        }
      >
        {items.map(({ icon: Icon, label, sublabel }) => (
          <div key={label} className="flex items-start gap-2.5">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                isHero
                  ? "border-white/15 bg-white/8 text-ek-teal"
                  : "border-ek-teal/20 bg-ek-teal/8 text-ek-teal"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p
                className={`text-[11px] font-bold leading-tight tracking-wide uppercase ${
                  isHero ? "text-white" : "text-ek-navy"
                }`}
              >
                {label}
              </p>
              <p className={`mt-0.5 text-[10px] ${isHero ? "text-white/55" : "text-ek-muted"}`}>
                {sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
