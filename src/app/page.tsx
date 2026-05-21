import dynamic from "next/dynamic";
import Board2D from "@/components/game/Board2D";
import Header from "@/components/ui/Header";
import ModeSelector from "@/components/ui/ModeSelector";
import DifficultySelector from "@/components/ui/DifficultySelector";
import Scoreboard from "@/components/ui/Scoreboard";
import GameControls from "@/components/ui/GameControls";
import ThinkingPanel from "@/components/ui/ThinkingPanel";
import VerdictBanner from "@/components/ui/VerdictBanner";
import SoundToggle from "@/components/ui/SoundToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Footer from "@/components/ui/Footer";
import SkipLink from "@/components/system/SkipLink";

// Below-the-fold; lazy-load to keep the initial bundle small.
const AlgorithmExplainer = dynamic(
  () => import("@/components/ui/AlgorithmExplainer"),
  { loading: () => <div className="h-px" /> },
);

export default function Home() {
  return (
    <div className="relative flex-1 flex flex-col">
      <SkipLink />

      {/* Top utility bar */}
      <div className="relative z-20 flex items-center justify-end gap-2 px-4 md:px-8 pt-4">
        <SoundToggle />
        <LanguageToggle />
      </div>

      <Header />

      <main className="relative z-10 px-4 md:px-8 pb-12 flex-1 flex justify-center">
        <div className="grid w-full max-w-7xl gap-5 lg:grid-cols-[18rem_minmax(0,1fr)_22rem]">
          {/* Left dock — game configuration */}
          <aside className="papyrus rounded-xl p-5 flex flex-col gap-5 order-2 lg:order-1">
            <ModeSelector />
            <div className="glyph-divider" />
            <DifficultySelector />
            <div className="glyph-divider" />
            <Scoreboard />
            <div className="glyph-divider" />
            <GameControls />
          </aside>

          {/* Center — the board */}
          <section
            id="game-board"
            className="relative flex items-start justify-center pt-2 order-1 lg:order-2 scroll-mt-4"
          >
            <div className="relative w-full max-w-[560px]">
              <VerdictBanner />
              <Board2D />
            </div>
          </section>

          {/* Right dock — minimax visualization */}
          <aside className="order-3 lg:max-h-[640px]">
            <ThinkingPanel />
          </aside>
        </div>
      </main>

      <div className="glyph-divider w-2/3 mx-auto" />

      <AlgorithmExplainer />

      <Footer />
    </div>
  );
}
