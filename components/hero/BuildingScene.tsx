"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Line, PerspectiveCamera } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function WireBuilding({
  scrollProgress,
  variant = "default",
}: {
  scrollProgress: number;
  variant?: "default" | "float";
}) {
  const group = useRef<THREE.Group>(null);
  const innerGlow = useRef<THREE.Group>(null);

  const floors = 8;
  const width = 2.4;
  const depth = 1.55;
  const floorHeight = 0.48;

  const { edges, accentEdges } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const accent: THREE.Vector3[] = [];
    const hw = width / 2;
    const hd = depth / 2;
    const h = floors * floorHeight;

    const corners = [
      new THREE.Vector3(-hw, 0, -hd),
      new THREE.Vector3(hw, 0, -hd),
      new THREE.Vector3(hw, 0, hd),
      new THREE.Vector3(-hw, 0, hd),
    ];

    for (let i = 0; i < 4; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % 4];
      pts.push(a.clone(), b.clone());
      pts.push(a.clone().setY(h), b.clone().setY(h));
      pts.push(a.clone(), a.clone().setY(h));
      accent.push(a.clone().setY(h), b.clone().setY(h));
    }

    for (let f = 1; f < floors; f++) {
      const y = f * floorHeight;
      for (let i = 0; i < 4; i++) {
        const a = corners[i].clone().setY(y);
        const b = corners[(i + 1) % 4].clone().setY(y);
        pts.push(a, b);
      }
    }

    for (let f = 0; f < floors; f++) {
      const y = f * floorHeight + floorHeight * 0.5;
      accent.push(
        new THREE.Vector3(-hw * 0.85, y, hd + 0.02),
        new THREE.Vector3(hw * 0.85, y, hd + 0.02),
      );
    }

    return { edges: pts, accentEdges: accent };
  }, []);

  useFrame((state) => {
    if (!group.current || !innerGlow.current) return;
    const p = scrollProgress;
    const t = state.clock.elapsedTime;
    const isFloat = variant === "float";

    group.current.rotation.y =
      THREE.MathUtils.lerp(isFloat ? -0.55 : -0.42, isFloat ? 0.35 : 0.52, p) +
      Math.sin(t * 0.3) * (isFloat ? 0.06 : 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(0.12, -0.08, p);
    group.current.position.y = THREE.MathUtils.lerp(isFloat ? -0.2 : -0.35, isFloat ? 0.1 : 0.15, p);
    group.current.scale.setScalar(THREE.MathUtils.lerp(isFloat ? 0.88 : 0.82, isFloat ? 1 : 1.08, p));

    innerGlow.current.rotation.y = group.current.rotation.y * 1.02;
    innerGlow.current.scale.setScalar(1.01);
  });

  const glassPanels = useMemo(() => {
    const panels: { pos: [number, number, number]; size: [number, number]; rotY: number }[] = [];
    for (let f = 0; f < floors; f++) {
      const y = f * floorHeight + floorHeight * 0.5;
      panels.push({
        pos: [0, y, depth / 2 + 0.015],
        size: [width * 0.88, floorHeight * 0.72],
        rotY: 0,
      });
      panels.push({
        pos: [width / 2 + 0.015, y, 0],
        size: [depth * 0.72, floorHeight * 0.72],
        rotY: Math.PI / 2,
      });
    }
    return panels;
  }, []);

  const reveal = 0.2 + scrollProgress * 0.8;
  const lineOpacity = variant === "float" ? 0.78 : 0.92;

  return (
    <group ref={group}>
      <Line points={edges} color="#db2022" lineWidth={variant === "float" ? 1.5 : 2} transparent opacity={lineOpacity} />
      <group ref={innerGlow}>
        <Line points={accentEdges} color="#ffffff" lineWidth={1} transparent opacity={0.35 + reveal * 0.25} />
      </group>

      {glassPanels.map((panel, i) => (
        <mesh key={i} position={panel.pos} rotation={[0, panel.rotY, 0]}>
          <planeGeometry args={panel.size} />
          <meshPhysicalMaterial
            color="#db2022"
            transparent
            opacity={0.08 + reveal * 0.42}
            metalness={0.35}
            roughness={0.08}
            transmission={0.72}
            thickness={0.35}
            emissive="#db2022"
            emissiveIntensity={0.08 + reveal * 0.12}
          />
        </mesh>
      ))}

      <mesh position={[0, floors * floorHeight * 0.5, 0]}>
        <boxGeometry args={[width * 1.03, floors * floorHeight, depth * 1.03]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.06 + reveal * 0.08} wireframe />
      </mesh>
    </group>
  );
}

function CameraRig({
  scrollProgress,
  variant,
}: {
  scrollProgress: number;
  variant?: "default" | "float";
}) {
  const { camera } = useThree();
  const compact = variant === "float";

  useFrame(() => {
    const p = scrollProgress;
    if (compact) {
      camera.position.x = THREE.MathUtils.lerp(3.2, 2.4, p);
      camera.position.y = THREE.MathUtils.lerp(2.4, 3, p);
      camera.position.z = THREE.MathUtils.lerp(4.2, 3.4, p);
      camera.lookAt(0, 1.5, 0);
      return;
    }
    camera.position.x = THREE.MathUtils.lerp(4.8, 3.2, p);
    camera.position.y = THREE.MathUtils.lerp(2.6, 3.4, p);
    camera.position.z = THREE.MathUtils.lerp(5.8, 4.6, p);
    camera.lookAt(0, 1.8, 0);
  });

  return null;
}

function Scene({
  scrollProgress,
  variant = "default",
}: {
  scrollProgress: number;
  variant?: "default" | "float";
}) {
  const isFloat = variant === "float";

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={isFloat ? [3.2, 2.4, 4.6] : [5.2, 2.4, 6.2]}
        fov={isFloat ? 44 : 38}
      />
      <CameraRig scrollProgress={scrollProgress} variant={variant} />
      <ambientLight intensity={isFloat ? 0.65 : 0.55} />
      <directionalLight position={[6, 10, 6]} intensity={isFloat ? 1.1 : 1.35} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={isFloat ? 0.7 : 0.55} color="#db2022" />
      <pointLight position={[0, 3, 2]} intensity={isFloat ? 0.55 : 0.4} color="#db2022" distance={12} />
      {!isFloat && (
        <Grid
          args={[12, 12]}
          cellSize={0.35}
          cellThickness={0.35}
          sectionSize={1.4}
          sectionThickness={0.6}
          fadeDistance={14}
          fadeStrength={1.2}
          cellColor="#2a2a2a"
          sectionColor="#db2022"
          position={[0, -0.01, 0]}
          rotation={[0, 0, 0]}
        />
      )}
      {isFloat && (
        <Grid
          args={[6, 6]}
          cellSize={0.4}
          cellThickness={0.2}
          sectionSize={1.6}
          sectionThickness={0.35}
          fadeDistance={5}
          fadeStrength={2}
          cellColor="#2a2a2a"
          sectionColor="#db2022"
          position={[0, -0.01, 0]}
          rotation={[0, 0, 0]}
        />
      )}
      <WireBuilding scrollProgress={scrollProgress} variant={variant} />
    </>
  );
}

export function BuildingScene({
  scrollProgress,
  variant = "default",
}: {
  scrollProgress: number;
  variant?: "default" | "float";
  compact?: boolean;
}) {
  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <Canvas gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} dpr={[1, 1.75]}>
        <Scene scrollProgress={scrollProgress} variant={variant} />
      </Canvas>
    </div>
  );
}
