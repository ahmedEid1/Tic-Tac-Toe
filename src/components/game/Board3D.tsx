"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import Cell3D from "./Cell3D";
import WinLine from "./WinLine";

const CELL_SPACING = 1.5;

function cellPositions(): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < 9; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    out.push([(col - 1) * CELL_SPACING, 0.18, (row - 1) * CELL_SPACING]);
  }
  return out;
}

export default function Board3D() {
  const group = useRef<THREE.Group>(null);
  const positions = cellPositions();

  // Gentle floating sway for the whole board.
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.6) * 0.06;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.04;
  });

  return (
    <group ref={group}>
      {/* Plinth — large stone slab supporting the board */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[5.4, 0.3, 5.4]} />
        <meshStandardMaterial
          color="#1a1612"
          metalness={0.2}
          roughness={0.85}
        />
      </mesh>
      {/* Gold inlay around the plinth edge — square frame matching the plinth */}
      <lineSegments position={[0, 0.105, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(5.2, 0.01, 5.2)]}
        />
        <lineBasicMaterial color="#d4af37" linewidth={2} />
      </lineSegments>
      {/* Inner gold ring around the 3x3 area */}
      <mesh position={[0, 0.111, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.45, 2.55, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cells */}
      {positions.map((pos, i) => (
        <Cell3D key={i} index={i} position={pos} />
      ))}

      {/* Winning line */}
      <WinLine />
    </group>
  );
}
