"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const HERO_MOBILE = "/images/hero-home.jpg";
const HERO_DESKTOP = "/images/hero-home-desktop.jpg";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={HERO_MOBILE}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={92}
        sizes="100vw"
        className="hero-photo object-cover object-[center_52%] lg:hidden"
      />
      <Image
        src={HERO_DESKTOP}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={92}
        sizes="100vw"
        className={`hero-photo hidden object-cover object-[58%_center] lg:block ${reduceMotion ? "" : "hero-ken-burns"}`}
      />
      <div className="hero-visual-glow absolute inset-0 lg:opacity-50" aria-hidden />
      <div className="hero-visual-overlay hero-visual-overlay--mobile absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-overlay hero-visual-overlay--desktop absolute inset-0 hidden lg:block" aria-hidden />
      <div className="hero-visual-vignette hero-visual-vignette--desktop absolute inset-0" aria-hidden />
    </div>
  );
}
