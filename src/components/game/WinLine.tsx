"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/store/gameStore";

const CELL_SPACING = 1.5;

function cellToPosition(i: number): [number, number, number] {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return [(col - 1) * CELL_SPACING, 0.18, (row - 1) * CELL_SPACING];
}

export default function WinLine() {
  const line = useGameStore((s) => s.result.line);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.5 + Math.sin(clock.elapsedTime * 4) * 0.4;
  });

  if (!line) return null;

  const [a, , c] = line;
  const start = new THREE.Vector3(...cellToPosition(a));
  const end = new THREE.Vector3(...cellToPosition(c));
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const length = dir.length() + 0.6;

  // Default cylinderGeometry runs along the Y axis; we orient it along dir.
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

  return (
    <mesh ref={meshRef} position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.08, 0.08, length, 16]} />
      <meshStandardMaterial
        color="#ffd966"
        emissive="#ffd966"
        emissiveIntensity={1.5}
        metalness={0.7}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}
