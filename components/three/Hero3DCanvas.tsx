"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const Hero3DScene = dynamic(
  () => import("@/components/three/Hero3DScene").then((m) => ({ default: m.Hero3DScene })),
  {
    ssr: false,
    loading: () => null,
  },
);

export function Hero3DCanvas() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="hero-3d-layer absolute inset-0 z-[1]" aria-hidden>
      <Hero3DScene reducedMotion={!!reduceMotion} />
    </div>
  );
}
