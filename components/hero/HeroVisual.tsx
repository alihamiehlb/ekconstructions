"use client";

import Image from "next/image";

export function HeroVisual() {
  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="hero-ken-burns object-cover object-[center_42%] lg:object-[center_38%]"
      />
      <div className="hero-visual-overlay absolute inset-0" aria-hidden />
      <div className="hero-visual-vignette absolute inset-0" aria-hidden />
    </div>
  );
}
