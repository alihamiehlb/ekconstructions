"use client";

import { Hero3DCanvas } from "@/components/three/Hero3DCanvas";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const HERO_IMAGE = "/images/hero-home.jpg";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-visual pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={90}
        sizes="100vw"
        className={`hero-photo object-cover ${reduceMotion ? "" : "hero-ken-burns"}`}
      />
      <Hero3DCanvas />
      <div className="hero-visual-overlay absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-visual-vignette absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-visual-glow absolute inset-0 z-[2]" aria-hidden />
    </div>
  );
}
