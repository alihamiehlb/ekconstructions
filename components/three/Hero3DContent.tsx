"use client";

import { sceneState, setScenePointer } from "@/lib/stores/scene-store";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { damp3, dampE } from "maath/easing";
import { useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import type { Group } from "three";

const FRAME = "#1a1a1a";
const GLASS = "#d4eaf7";
const ACCENT = "#db2022";

function GlassWindow({
  width,
  height,
  position,
  rotation = [0, 0, 0],
  panes = [2, 3] as [number, number],
}: {
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  panes?: [number, number];
}) {
  const [cols, rows] = panes;
  const inset = 0.035;

  const mullions = useMemo(() => {
    const items: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    const pw = width * 0.9;
    const ph = height * 0.9;
    for (let c = 1; c < cols; c++) {
      items.push({
        pos: [-pw / 2 + (pw / cols) * c, 0, inset],
        scale: [0.022, ph, 0.05],
      });
    }
    for (let r = 1; r < rows; r++) {
      items.push({
        pos: [0, -ph / 2 + (ph / rows) * r, inset],
        scale: [pw, 0.022, 0.05],
      });
    }
    return items;
  }, [cols, rows, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width, height, 0.07]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, inset]}>
        <planeGeometry args={[width * 0.9, height * 0.9]} />
        <meshPhysicalMaterial
          color={GLASS}
          metalness={0.02}
          roughness={0.06}
          transmission={0.9}
          thickness={0.12}
          ior={1.48}
          transparent
          opacity={0.94}
        />
      </mesh>
      {mullions.map((m, i) => (
        <mesh key={i} position={m.pos} scale={m.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={FRAME} metalness={0.88} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0, inset + 0.015]}>
        <planeGeometry args={[width * 0.88, height * 0.88]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function GlassFacade() {
  const group = useRef<Group>(null);
  const snap = useSnapshot(sceneState);

  useFrame((state, delta) => {
    if (!group.current) return;
    damp3(
      group.current.position,
      [1.6 + snap.scroll * -0.15, snap.pointer.y * 0.06, 0],
      0.5,
      delta,
    );
    dampE(
      group.current.rotation,
      [snap.pointer.y * 0.03, snap.pointer.x * 0.06 + state.clock.elapsedTime * 0.015, 0],
      0.4,
      delta,
    );
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <GlassWindow width={2.5} height={3.3} position={[0, 0.15, 0]} rotation={[0, -0.32, 0]} panes={[3, 4]} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.14} floatIntensity={0.25}>
        <GlassWindow width={1.5} height={2} position={[-1.5, -0.55, 0.5]} rotation={[0.06, 0.22, 0]} panes={[2, 3]} />
      </Float>
    </group>
  );
}

export function Hero3DContent() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 5]} intensity={1.1} />
      <directionalLight position={[-4, 2, 3]} intensity={0.35} color={ACCENT} />
      <GlassFacade />
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
