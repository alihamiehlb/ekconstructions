"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <motion.div
      ref={ref}
      style={{ y: imageY }}
      className="relative mx-auto w-full max-w-[580px] lg:absolute lg:inset-x-0 lg:top-0 lg:mx-0 lg:max-w-none lg:-translate-y-6 xl:-translate-y-10"
    >
      <div className="relative aspect-[1.02/1] w-full sm:aspect-[1.05/1] lg:aspect-[1.1/1] lg:max-h-[480px] xl:max-h-[520px]">
        <Image
          src="/images/hero-building.png"
          alt="Modern glass and aluminium building by EK Constructions"
          fill
          priority
          quality={92}
          sizes="(max-width: 1024px) 92vw, 56vw"
          className="object-contain object-[center_10%] sm:object-[center_6%] lg:object-right lg:object-top"
        />
      </div>
    </motion.div>
  );
}
