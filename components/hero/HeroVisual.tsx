"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const HERO_IMAGE = "/images/hero-home.jpg";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-visual pointer-events-none relative h-full w-full overflow-hidden" aria-hidden>
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={90}
        sizes="(min-width: 1024px) 48vw, 100vw"
        className={`hero-photo relative h-full w-full ${reduceMotion ? "" : "hero-ken-burns lg:hero-ken-burns-off"}`}
      />
      <div className="hero-visual-glow absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-overlay hero-visual-overlay--mobile absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-vignette absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-panel-fade absolute inset-0 hidden lg:block" aria-hidden />
      <div className="hero-visual-panel-vignette absolute inset-0 hidden lg:block" aria-hidden />
    </div>
  );
}
