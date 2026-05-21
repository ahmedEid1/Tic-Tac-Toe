"use client";

import dynamic from "next/dynamic";

// The 3D scene is client-only (uses WebGL/window); SSR makes no sense for it.
// Wrapping the dynamic import in a client component keeps the parent page
// renderable as a server component.
const GameScene = dynamic(() => import("./GameScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-gold-bright shimmer font-display tracking-[0.3em] text-xs">
      Summoning the board…
    </div>
  ),
});

export default function GameSceneClient() {
  return <GameScene />;
}
