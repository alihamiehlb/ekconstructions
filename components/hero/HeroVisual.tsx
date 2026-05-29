"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const BuildingScene = dynamic(
  () => import("@/components/hero/BuildingScene").then((m) => m.BuildingScene),
  { ssr: false, loading: () => null },
);

type Props = {
  scrollProgress: number;
};

export function HeroVisual({ scrollProgress }: Props) {
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
      className="relative mx-auto w-full max-w-[520px] lg:absolute lg:inset-x-0 lg:top-0 lg:mx-0 lg:max-w-none lg:-translate-y-6 xl:-translate-y-10"
    >
      <div className="relative aspect-[4/3] w-full max-h-[min(78vw,320px)] sm:max-h-[360px] lg:aspect-[1.1/1] lg:max-h-[480px] xl:max-h-[520px]">
        <Image
          src="/images/hero-building.png"
          alt="Modern glass and aluminium building by EK Constructions"
          fill
          priority
          quality={92}
          sizes="(max-width: 1024px) 92vw, 56vw"
          className="object-contain object-[center_8%] sm:object-[center_6%] lg:object-right lg:object-top"
        />

        {/* Mobile: wireframe blended on the house — not a separate block above it */}
        <div className="hero-scene-blend pointer-events-none absolute inset-0 lg:hidden" aria-hidden>
          <div className="absolute inset-[10%_8%_14%_22%]">
            <BuildingScene scrollProgress={scrollProgress} variant="float" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
