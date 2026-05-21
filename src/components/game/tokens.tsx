"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const GOLD_MATERIAL = {
  color: "#d4af37",
  emissive: "#5a3f10",
  metalness: 0.95,
  roughness: 0.22,
} as const;
const LAPIS_COLOR = "#1f4e8c";
const LAPIS_EMISSIVE = "#0a1e3f";

/**
 * Common spawn animation: scales the token from 0 → 1 with a slight bounce,
 * and rises from below the board to its resting position over ~400ms.
 */
function useSpawn() {
  const group = useRef<THREE.Group>(null);
  // Initialized on the first frame to keep this hook pure during render.
  const start = useRef<number | null>(null);
  const duration = 420;

  useFrame(() => {
    if (!group.current) return;
    if (start.current === null) start.current = performance.now();
    const elapsed = performance.now() - start.current;
    const t = Math.min(1, elapsed / duration);
    // ease-out-back
    const c1 = 1.4;
    const c3 = c1 + 1;
    const eased = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    group.current.scale.setScalar(eased);
    group.current.position.y = -0.6 + 0.6 * t;
  });

  return group;
}

export function AnkhToken({
  scale = 1,
  rotation = 0,
}: {
  scale?: number;
  rotation?: number;
}) {
  const group = useSpawn();

  return (
    <group ref={group} rotation={[0, rotation, 0]} scale={[scale, scale, scale]}>
      {/* Loop at the top (torus) */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.075, 18, 36]} />
        <meshStandardMaterial {...GOLD_MATERIAL} />
      </mesh>
      {/* Vertical stem */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.16, 0.95, 0.12]} />
        <meshStandardMaterial {...GOLD_MATERIAL} />
      </mesh>
      {/* Horizontal crossbar */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.82, 0.16, 0.12]} />
        <meshStandardMaterial {...GOLD_MATERIAL} />
      </mesh>
    </group>
  );
}

export function EyeToken({
  scale = 1,
  rotation = 0,
}: {
  scale?: number;
  rotation?: number;
}) {
  const group = useSpawn();

  // Extruded almond-shape for the eye outline.
  const eyeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.55, 0);
    shape.quadraticCurveTo(-0.3, 0.32, 0, 0.32);
    shape.quadraticCurveTo(0.3, 0.32, 0.55, 0);
    shape.quadraticCurveTo(0.3, -0.32, 0, -0.32);
    shape.quadraticCurveTo(-0.3, -0.32, -0.55, 0);

    const hole = new THREE.Path();
    hole.moveTo(-0.38, 0);
    hole.quadraticCurveTo(-0.2, 0.18, 0, 0.18);
    hole.quadraticCurveTo(0.2, 0.18, 0.38, 0);
    hole.quadraticCurveTo(0.2, -0.18, 0, -0.18);
    hole.quadraticCurveTo(-0.2, -0.18, -0.38, 0);
    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 32,
    });
  }, []);

  return (
    <group ref={group} rotation={[Math.PI / 2, rotation, 0]} scale={[scale, scale, scale]}>
      {/* Gold almond outline */}
      <mesh geometry={eyeGeometry} castShadow>
        <meshStandardMaterial {...GOLD_MATERIAL} />
      </mesh>
      {/* Lapis iris */}
      <mesh position={[0, 0, 0.18]} castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color={LAPIS_COLOR}
          emissive={LAPIS_EMISSIVE}
          metalness={0.4}
          roughness={0.45}
        />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.3]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#0c0a08" roughness={0.7} />
      </mesh>
      {/* Cheek mark — small angled bar below */}
      <mesh position={[-0.35, -0.32, 0.08]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.32, 0.08, 0.1]} />
        <meshStandardMaterial {...GOLD_MATERIAL} />
      </mesh>
      {/* Spiral curl on the right side */}
      <mesh position={[0.4, -0.28, 0.08]} rotation={[0, 0, 0.6]} castShadow>
        <torusGeometry args={[0.13, 0.04, 12, 18, Math.PI * 1.4]} />
        <meshStandardMaterial {...GOLD_MATERIAL} />
      </mesh>
    </group>
  );
}
