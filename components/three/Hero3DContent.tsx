"use client";

import { sceneState, setScenePointer } from "@/lib/stores/scene-store";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { damp3, dampE } from "maath/easing";
import { useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import type { Group } from "three";

const BRAND_RED = "#db2022";
const FRAME = "#1c1c1c";
const GLASS = "#b8d9f0";

type GlassWindowProps = {
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  panes?: [number, number];
};

function GlassWindow({
  width,
  height,
  position,
  rotation = [0, 0, 0],
  panes = [2, 3],
}: GlassWindowProps) {
  const snap = useSnapshot(sceneState);
  const samples =
    snap.quality === "high" ? 6 : snap.quality === "medium" ? 4 : 2;
  const [cols, rows] = panes;
  const frameDepth = 0.07;
  const glassInset = 0.035;

  const mullions = useMemo(() => {
    const items: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    const pw = width * 0.9;
    const ph = height * 0.9;

    for (let c = 1; c < cols; c++) {
      const x = -pw / 2 + (pw / cols) * c;
      items.push({ pos: [x, 0, glassInset], scale: [0.025, ph, frameDepth * 0.6] });
    }
    for (let r = 1; r < rows; r++) {
      const y = -ph / 2 + (ph / rows) * r;
      items.push({ pos: [0, y, glassInset], scale: [pw, 0.025, frameDepth * 0.6] });
    }
    return items;
  }, [cols, rows, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width, height, frameDepth]} />
        <meshStandardMaterial color={FRAME} metalness={0.94} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, glassInset]}>
        <planeGeometry args={[width * 0.9, height * 0.9]} />
        <MeshTransmissionMaterial
          transmission={0.94}
          thickness={0.12}
          roughness={0.04}
          ior={1.45}
          chromaticAberration={0.04}
          color={GLASS}
          attenuationColor={BRAND_RED}
          attenuationDistance={3}
          samples={samples}
        />
      </mesh>
      {mullions.map((m, i) => (
        <mesh key={i} position={m.pos} scale={m.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={FRAME} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0, glassInset + 0.02]}>
        <planeGeometry args={[width * 0.88, height * 0.88]} />
        <meshBasicMaterial color={BRAND_RED} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function GlassFacade() {
  const group = useRef<Group>(null);
  const snap = useSnapshot(sceneState);

  useFrame((state, delta) => {
    if (!group.current || snap.reducedMotion) return;
    damp3(
      group.current.position,
      [1.8 + snap.scroll * -0.2, snap.pointer.y * 0.08, snap.scroll * 0.05],
      0.55,
      delta,
    );
    dampE(
      group.current.rotation,
      [snap.pointer.y * 0.04, snap.pointer.x * 0.08 + state.clock.elapsedTime * 0.02, 0],
      0.45,
      delta,
    );
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}>
        <GlassWindow
          width={2.4}
          height={3.2}
          position={[0, 0.2, 0]}
          rotation={[0, -0.35, 0]}
          panes={[3, 4]}
        />
      </Float>
      <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.3}>
        <GlassWindow
          width={1.6}
          height={2.1}
          position={[-1.6, -0.5, 0.6]}
          rotation={[0.08, 0.25, 0.05]}
          panes={[2, 3]}
        />
      </Float>
      <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.2}>
        <GlassWindow
          width={1.1}
          height={1.5}
          position={[1.5, 1.1, -0.4]}
          rotation={[-0.05, -0.55, 0]}
          panes={[2, 2]}
        />
      </Float>
    </group>
  );
}

export function Hero3DContent() {
  const snap = useSnapshot(sceneState);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 6]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-6, 3, 2]} intensity={0.4} color={BRAND_RED} />
      <pointLight position={[2, 1, 4]} intensity={0.5} color="#ffffff" distance={14} />

      {!snap.reducedMotion && snap.quality === "high" ? (
        <Environment preset="city" environmentIntensity={0.35} />
      ) : null}

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
