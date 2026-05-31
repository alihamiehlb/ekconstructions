"use client";

import { HeroAccentLines } from "@/components/hero/HeroAccentLines";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const HERO_MOBILE = "/images/hero-home.jpg";
const HERO_DESKTOP = "/images/hero-home-desktop.jpg";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 48]);

  return (
    <div ref={ref} className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <Image
          src={HERO_MOBILE}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={82}
          sizes="100vw"
          className="object-cover object-[center_52%] lg:hidden"
        />
        <Image
          src={HERO_DESKTOP}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={82}
          sizes="100vw"
          className={`hidden object-cover object-[58%_center] lg:block ${reduceMotion ? "" : "hero-ken-burns hero-parallax-layer"}`}
        />
      </motion.div>
      <HeroAccentLines />
      <div className="hero-visual-glow absolute inset-0 opacity-80" aria-hidden />
      <div className="hero-visual-overlay hero-visual-overlay--mobile absolute inset-0 lg:hidden" aria-hidden />
      <div className="hero-visual-overlay absolute inset-0 hidden lg:block" aria-hidden />
      <div className="hero-visual-vignette absolute inset-0" aria-hidden />
    </div>
  );
}
