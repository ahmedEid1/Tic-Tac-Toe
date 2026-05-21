import HieroglyphBackground from "@/components/decorative/HieroglyphBackground";
import Header from "@/components/ui/Header";
import ModeSelector from "@/components/ui/ModeSelector";
import DifficultySelector from "@/components/ui/DifficultySelector";
import Scoreboard from "@/components/ui/Scoreboard";
import GameControls from "@/components/ui/GameControls";
import ThinkingPanel from "@/components/ui/ThinkingPanel";
import AlgorithmExplainer from "@/components/ui/AlgorithmExplainer";
import VerdictBanner from "@/components/ui/VerdictBanner";
import SoundToggle from "@/components/ui/SoundToggle";
import GameSceneClient from "@/components/game/GameSceneClient";

export default function Home() {
  return (
    <div className="relative flex-1 flex flex-col">
      <HieroglyphBackground />

      <Header />

      {/* Main stage: 3D scene + side panels */}
      <main className="relative z-10 px-4 md:px-8 pb-12 flex-1 flex justify-center">
        <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[20rem_1fr_22rem]">
          {/* Left dock — game configuration */}
          <aside className="papyrus rounded-xl p-5 flex flex-col gap-5 order-2 lg:order-1">
            <div className="flex items-center justify-between">
              <p className="font-display text-[10px] tracking-[0.4em] text-gold uppercase">
                Sanctum
              </p>
              <SoundToggle />
            </div>
            <ModeSelector />
            <div className="glyph-divider" />
            <DifficultySelector />
            <div className="glyph-divider" />
            <Scoreboard />
            <div className="glyph-divider" />
            <GameControls />
          </aside>

          {/* Center — the 3D board */}
          <section className="relative rounded-xl overflow-hidden papyrus min-h-[480px] lg:min-h-[640px] order-1 lg:order-2">
            <VerdictBanner />
            <GameSceneClient />
          </section>

          {/* Right dock — minimax visualization */}
          <aside className="order-3 min-h-[480px] lg:min-h-[640px]">
            <ThinkingPanel />
          </aside>
        </div>
      </main>

      <div className="glyph-divider w-2/3 mx-auto" />

      <AlgorithmExplainer />

      <footer className="relative z-10 text-center py-6 text-papyrus-dim text-xs italic border-t border-gold/15">
        Built with Next.js, React Three Fiber & a touch of papyrus dust.
      </footer>
    </div>
  );
}
