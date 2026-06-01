"use client";

import { Hero3DContent, Hero3DPointerLayer } from "@/components/three/Hero3DContent";
import { Canvas } from "@react-three/fiber";

export function Hero3DScene() {
  return (
    <Canvas
      className="hero-3d-canvas"
      camera={{ position: [0.4, 0.1, 6], fov: 38, near: 0.1, far: 50 }}
      dpr={[1, 1.35]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Hero3DContent />
      <Hero3DPointerLayer />
    </Canvas>
  );
}
