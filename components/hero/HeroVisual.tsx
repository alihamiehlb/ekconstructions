"use client";

import Image from "next/image";

const MOBILE_HERO_SRC = "/images/hero-phone-v2.jpg";

export function HeroVisual() {
  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={MOBILE_HERO_SRC}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[62%_58%] lg:hidden"
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
      <div className="hero-visual-vignette absolute inset-0 hidden lg:block" aria-hidden />
    </div>
  );
}
