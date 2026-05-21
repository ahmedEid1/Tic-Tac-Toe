"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Subtle 3D background — distant pyramid silhouettes and drifting motes.
 * Lives behind the board to give depth without stealing attention.
 */
export default function DesertBackdrop() {
  return (
    <>
      <Pyramid position={[-10, -4, -18]} scale={3.5} rotationY={0.3} />
      <Pyramid position={[-3, -4, -22]} scale={5} rotationY={-0.4} />
      <Pyramid position={[9, -4, -20]} scale={4} rotationY={0.2} />
      <Motes />
    </>
  );
}

function Pyramid({
  position,
  scale,
  rotationY,
}: {
  position: [number, number, number];
  scale: number;
  rotationY: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <coneGeometry args={[1, 1.3, 4]} />
      <meshStandardMaterial
        color="#5a3f1e"
        metalness={0.05}
        roughness={1}
        emissive="#2a1a0a"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function Motes() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 60;
  // Deterministic pseudo-random — keeps render pure and motes stable across
  // renders, but still visually irregular.
  const seeds = useMemo(() => {
    const rand = (i: number, salt: number) => {
      const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      x: (rand(i, 1) - 0.5) * 18,
      y: rand(i, 2) * 6 - 1,
      z: (rand(i, 3) - 0.5) * 14 - 4,
      s: 0.02 + rand(i, 4) * 0.04,
      phase: rand(i, 5) * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((seed, i) => {
      dummy.position.set(
        seed.x + Math.sin(t * 0.2 + seed.phase) * 0.6,
        seed.y + Math.sin(t * 0.4 + seed.phase) * 0.4,
        seed.z,
      );
      dummy.scale.setScalar(seed.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffd966" transparent opacity={0.55} />
    </instancedMesh>
  );
}
