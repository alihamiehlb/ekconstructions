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
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    sceneState.quality = w < 768 ? "low" : w < 1280 ? "medium" : "high";
  }, [reducedMotion]);

  return (
    <Canvas
      className="hero-3d-canvas"
      camera={{ position: [0.5, 0.15, 6.2], fov: 40, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
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
