"use client";

import { Hero3DContent, Hero3DPointerLayer } from "@/components/three/Hero3DContent";
import { sceneState, setReducedMotion, setWebglReady } from "@/lib/stores/scene-store";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";

type Hero3DSceneProps = {
  reducedMotion?: boolean;
};

export function Hero3DScene({ reducedMotion = false }: Hero3DSceneProps) {
  useEffect(() => {
    setReducedMotion(reducedMotion);
    sceneState.quality =
      typeof window !== "undefined" && window.innerWidth < 1280 ? "low" : "high";
  }, [reducedMotion]);

  return (
    <Canvas
      className="hero-3d-canvas"
      camera={{ position: [0, 0.4, 5.5], fov: 42, near: 0.1, far: 40 }}
      dpr={[1, 1.75]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={() => setWebglReady(true)}
      style={{ background: "transparent" }}
    >
      <Hero3DContent />
      <Hero3DPointerLayer />
    </Canvas>
  );
}
