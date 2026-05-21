"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Board3D from "./Board3D";
import DesertBackdrop from "./DesertBackdrop";

export default function GameScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 7, 8], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/* Lighting — warm sun + soft fill + accent under-glow */}
      <ambientLight intensity={0.5} color="#f0debb" />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.6}
        color="#ffd966"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#1f4e8c" />
      <pointLight position={[0, -1, 0]} intensity={0.35} color="#d4af37" />

      <DesertBackdrop />
      <Board3D />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
