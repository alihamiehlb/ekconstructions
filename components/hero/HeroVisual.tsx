"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type Props = {
  scrollProgress: number;
};

export function HeroVisual({ scrollProgress }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  return (
    <div ref={ref} className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[center_42%] lg:object-[center_38%]"
        />
      </motion.div>

      <div className="hero-visual-overlay absolute inset-0" aria-hidden />
      <div
        className="hero-visual-vignette absolute inset-0"
        style={{ opacity: 0.25 + scrollProgress * 0.35 }}
        aria-hidden
      />
    </div>
  );
}
