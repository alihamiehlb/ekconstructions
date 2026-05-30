"use client";

import { HeroAccentGraphic } from "@/components/hero/HeroAccentGraphic";

type Props = {
  scrollProgress: number;
};

/** Desktop — accent beside headline, never on the hero photo. */
export function HeroFloatingScene({ scrollProgress }: Props) {
  return (
    <div
      className="pointer-events-none absolute z-[8] hidden lg:block"
      style={{ top: "12%", left: "38%", width: "240px", height: "280px" }}
    >
      <HeroAccentGraphic scrollProgress={scrollProgress} />
    </div>
  );
}

/** Mobile — below hero image, above Services. */
export function HeroMobileAccent({ scrollProgress }: Props) {
  return (
    <div className="pointer-events-none mx-auto h-[130px] w-[220px] sm:h-[150px] sm:w-[260px] lg:hidden">
      <HeroAccentGraphic compact scrollProgress={scrollProgress} />
    </div>
  );
}
