"use client";

import { sceneState, setScenePointer } from "@/lib/stores/scene-store";
import { Edges, Float, Grid, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { damp3, dampE } from "maath/easing";
import { useRef } from "react";
import { useSnapshot } from "valtio";
import type { Group } from "three";

const BRAND_RED = "#db2022";
const FRAME_COLOR = "#e8e8e8";

function AluminiumFrame({
  position,
  scale,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group position={position} scale={scale} rotation={rotation}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={FRAME_COLOR}
            metalness={0.92}
            roughness={0.18}
            envMapIntensity={1.2}
          />
          <Edges color={BRAND_RED} threshold={15} />
        </mesh>
      </group>
    </Float>
  );
}

function ArchitecturalCluster() {
  const cluster = useRef<Group>(null);
  const snap = useSnapshot(sceneState);

  useFrame((state, delta) => {
    if (!cluster.current || snap.reducedMotion) return;
    damp3(cluster.current.position, [0, snap.scroll * -0.15, 0], 0.5, delta);
    dampE(
      cluster.current.rotation,
      [snap.pointer.y * 0.06, snap.pointer.x * 0.1 + state.clock.elapsedTime * 0.04, 0],
      0.4,
      delta,
    );
  });

  return (
    <group ref={cluster}>
      <AluminiumFrame position={[-1.4, 0.6, 0.8]} scale={[1.8, 2.4, 0.08]} rotation={[0, 0.4, 0]} />
      <AluminiumFrame position={[1.2, -0.2, 0.5]} scale={[1.2, 1.6, 0.06]} rotation={[0, -0.25, 0.05]} />
      <AluminiumFrame position={[0.2, 1.1, -0.3]} scale={[2.2, 0.9, 0.05]} rotation={[0.1, 0.15, 0]} />
      <AluminiumFrame position={[-0.5, -1, 0.2]} scale={[1.4, 1.4, 0.07]} rotation={[0, 0.6, 0]} />
    </group>
  );
}

function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.35} transparent opacity={0.55} />
    </mesh>
  );
}

export function Hero3DContent() {
  const snap = useSnapshot(sceneState);

  return (
    <>
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color={BRAND_RED} />
      <pointLight position={[0, 2, 3]} intensity={0.6} color={BRAND_RED} distance={12} />

      <group position={[0, -0.2, 0]}>
        <ArchitecturalCluster />
        <ReflectiveFloor />
        <Grid
          position={[0, -2.19, 0]}
          args={[14, 14]}
          cellSize={0.45}
          cellThickness={0.35}
          cellColor={BRAND_RED}
          sectionSize={2.25}
          sectionThickness={0.6}
          sectionColor="#ffffff"
          fadeDistance={16}
          fadeStrength={1.2}
          infiniteGrid
        />
        {!snap.reducedMotion && (
          <Sparkles
            count={snap.quality === "high" ? 48 : 24}
            scale={[8, 5, 4]}
            size={2}
            speed={0.25}
            opacity={0.35}
            color={BRAND_RED}
          />
        )}
      </group>
    </>
  );
}

export function Hero3DPointerLayer() {
  return (
    <mesh
      visible={false}
      onPointerMove={(e) => {
        e.stopPropagation();
        setScenePointer((e.pointer.x - 0.5) * 2, (e.pointer.y - 0.5) * 2);
      }}
      onPointerLeave={() => setScenePointer(0, 0)}
    >
      <planeGeometry args={[20, 20]} />
    </mesh>
  );
}
