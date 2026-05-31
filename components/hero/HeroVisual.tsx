"use client";

import Image from "next/image";

const HERO_SRC = "/images/hero-home.jpg";

export function HeroVisual() {
  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={HERO_SRC}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="hero-ken-burns object-cover object-[center_42%]"
      />
      <div className="hero-visual-overlay hero-visual-overlay--mobile absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-overlay absolute inset-0 hidden lg:block" aria-hidden />
      <div className="hero-visual-vignette absolute inset-0" aria-hidden />
    </div>
  );
}
