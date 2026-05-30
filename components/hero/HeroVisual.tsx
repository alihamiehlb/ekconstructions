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
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.2]);

  return (
    <div ref={ref} className="hero-visual pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-visual-gradient absolute inset-0" aria-hidden />

      <motion.div
        style={{ opacity: glowOpacity }}
        className="hero-visual-glow absolute inset-0"
        aria-hidden
      />

      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="hero-visual-image absolute inset-x-0 bottom-0 top-[18%] sm:top-[12%] lg:top-[8%]"
      >
        <div className="relative mx-auto h-full w-full max-w-[920px] lg:max-w-[980px] xl:max-w-[1040px]">
          <Image
            src="/images/hero-building.png"
            alt="Modern aluminium, glass and steel construction by EK Constructions"
            fill
            priority
            quality={92}
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-contain object-bottom lg:object-[center_85%]"
          />
          <div className="hero-wireframe-shimmer absolute inset-y-[8%] left-[2%] w-[46%] rounded-sm" aria-hidden />
        </div>
      </motion.div>

      <div
        className="hero-visual-vignette absolute inset-0"
        style={{ opacity: 0.35 + scrollProgress * 0.25 }}
        aria-hidden
      />
    </div>
  );
}
