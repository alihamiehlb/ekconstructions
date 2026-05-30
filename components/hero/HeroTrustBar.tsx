"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Award, MapPin, Shield, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Shield, label: "30+ Years Experience", key: "years" },
  { icon: MapPin, label: "Sydney & Greater NSW", key: "location" },
  { icon: Award, label: "Fully Licensed & Insured", key: "licensed" },
  { icon: ShieldCheck, label: "Australian Standards Compliant", key: "standards" },
] as const;

export function HeroTrustBar() {
  const site = useSite();

  const labels: Record<string, string> = {
    years: `${site.business.yearsExperience} Years Experience`,
    location: site.location.area,
    licensed: "Fully Licensed & Insured",
    standards: "Australian Standards Compliant",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10"
    >
      <div className="landing-container">
        <div className="hero-trust-bar grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 sm:grid-cols-4 sm:gap-4 sm:px-6 sm:py-5">
          {items.map(({ icon: Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.08, duration: 0.45 }}
              className="flex items-start gap-2.5 sm:gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ek-teal/15 text-ek-teal sm:h-10 sm:w-10">
                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
              </span>
              <p className="pt-1 text-[9px] font-bold leading-snug tracking-[0.06em] text-white uppercase sm:text-[10px]">
                {labels[key]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
