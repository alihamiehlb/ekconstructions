"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

const BuildingScene = dynamic(
  () => import("@/components/hero/BuildingScene").then((m) => m.BuildingScene),
  { ssr: false, loading: () => null },
);

type Props = {
  scrollProgress: number;
};

function SceneLayer({
  scrollProgress,
  className,
  style,
}: Props & { className: string; style?: CSSProperties }) {
  return (
    <div className={`hero-scene-blend pointer-events-none ${className}`} style={style} aria-hidden>
      <BuildingScene scrollProgress={scrollProgress} variant="float" />
    </div>
  );
}

/** Desktop only — gap between headline and building */
export function HeroFloatingScene({ scrollProgress }: Props) {
  return (
    <SceneLayer
      scrollProgress={scrollProgress}
      className="absolute z-[8] hidden h-[260px] w-[240px] -translate-x-1/3 lg:block xl:h-[300px] xl:w-[280px] xl:-translate-x-1/4"
      style={{ top: "14%", left: "40%" }}
    />
  );
}
