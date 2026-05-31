"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const HERO_IMAGE = "/images/hero-home.jpg";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={90}
        sizes="100vw"
        className={`hero-photo ${reduceMotion ? "" : "hero-ken-burns"}`}
      />
      <div className="hero-visual-glow absolute inset-0 lg:opacity-50" aria-hidden />
      <div className="hero-visual-overlay hero-visual-overlay--mobile absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-overlay hero-visual-overlay--desktop absolute inset-0 hidden lg:block" aria-hidden />
      <div className="hero-visual-vignette hero-visual-vignette--desktop absolute inset-0" aria-hidden />
    </div>
  );
}
