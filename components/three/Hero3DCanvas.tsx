"use client";

import { Hero3DErrorBoundary } from "@/components/three/Hero3DErrorBoundary";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Hero3DScene = dynamic(
  () => import("@/components/three/Hero3DScene").then((m) => ({ default: m.Hero3DScene })),
  { ssr: false, loading: () => null },
);

export function Hero3DCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  return (
    <div className="hero-3d-layer pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      <Hero3DErrorBoundary>
        <Hero3DScene />
      </Hero3DErrorBoundary>
    </div>
  );
}
