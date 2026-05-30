"use client";

import Image from "next/image";

export function HeroVisual() {
  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/images/hero-building.png"
        alt=""
        fill
        priority
        quality={78}
        sizes="100vw"
        className="hero-ken-burns object-cover object-[center_35%] lg:hidden"
      />
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="hero-ken-burns hidden object-cover object-[center_38%] lg:block"
      />
      <div className="hero-visual-overlay hero-visual-overlay--mobile absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-overlay absolute inset-0 hidden lg:block" aria-hidden />
      <div className="hero-visual-vignette absolute inset-0" aria-hidden />
    </div>
  );
}
