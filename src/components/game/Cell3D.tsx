"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";
import { AnkhToken, EyeToken } from "./tokens";

interface Cell3DProps {
  index: number;
  position: [number, number, number];
}

export default function Cell3D({ index, position }: Cell3DProps) {
  const value = useGameStore((s) => s.board[index]);
  const playerMove = useGameStore((s) => s.playerMove);
  const aiThinking = useGameStore((s) => s.aiThinking);
  const result = useGameStore((s) => s.result);
  const turn = useGameStore((s) => s.turn);
  const turnConfig = useGameStore((s) => s[turn]);
  const trace = useGameStore((s) => s.lastAiTrace);
  const winningLine = useGameStore((s) => s.result.line);

  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const isWinning = !!winningLine && winningLine.includes(index as 0);
  const isClickable =
    !value && result.status === "playing" && !aiThinking && !turnConfig.isAi;
  const score = trace?.candidateScores?.[index];
  const showScore =
    score !== undefined &&
    !value &&
    aiThinking === false &&
    result.status === "playing";

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetEmissive = isWinning
      ? 0.55
      : hovered && isClickable
        ? 0.18
        : 0.04;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      targetEmissive,
      Math.min(1, delta * 8),
    );
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isClickable) return;
    playerMove(index);
  };

  return (
    <group position={position}>
      {/* Cell tile */}
      <mesh
        ref={meshRef}
        receiveShadow
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (isClickable) {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[1.4, 0.12, 1.4]} />
        <meshStandardMaterial
          color={isWinning ? "#d4af37" : "#1f1610"}
          emissive={isWinning ? "#ffd966" : "#d4af37"}
          emissiveIntensity={0.04}
          metalness={0.35}
          roughness={0.6}
        />
      </mesh>

      {/* Sub-tile gold frame — only shown on empty cells, very subtle */}
      {!value && (
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.64, 32]} />
          <meshBasicMaterial
            color={isWinning ? "#ffd966" : hovered ? "#d4af37" : "#5a4218"}
            transparent
            opacity={isWinning ? 1 : hovered ? 0.9 : 0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Piece */}
      {value === "ankh" && (
        <group position={[0, 0.06, 0]} key={`ankh-${index}`}>
          <AnkhToken />
        </group>
      )}
      {value === "eye" && (
        <group position={[0, 0.32, 0]} key={`eye-${index}`}>
          <EyeToken />
        </group>
      )}

      {/* AI score overlay above empty cells */}
      {showScore && (
        <Html
          position={[0, 0.7, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <ScorePill score={score!} />
        </Html>
      )}
    </group>
  );
}

function ScorePill({ score }: { score: number }) {
  const color =
    score > 0
      ? "text-gold-bright border-gold/60 bg-gold/10"
      : score < 0
        ? "text-blood-red border-blood-red/40 bg-blood-red/10"
        : "text-turquoise border-turquoise/40 bg-turquoise/10";
  const sign = score > 0 ? "+" : "";
  return (
    <div
      className={`font-mono text-[10px] px-1.5 py-0.5 rounded border backdrop-blur-sm ${color}`}
    >
      {sign}
      {score}
    </div>
  );
}
