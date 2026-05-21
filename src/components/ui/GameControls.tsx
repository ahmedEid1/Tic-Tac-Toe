"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useStrings } from "@/lib/i18n";
import { sound } from "@/lib/sound";

export default function GameControls() {
  const t = useStrings();
  const mode = useGameStore((s) => s.mode);
  const autoPlay = useGameStore((s) => s.autoPlay);
  const speedMs = useGameStore((s) => s.speedMs);
  const result = useGameStore((s) => s.result);
  const setAutoPlay = useGameStore((s) => s.setAutoPlay);
  const setSpeedMs = useGameStore((s) => s.setSpeedMs);
  const rematch = useGameStore((s) => s.rematch);
  const reset = useGameStore((s) => s.reset);
  const stepAi = useGameStore((s) => s.stepAi);

  const showAvaControls = mode === "ava";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        <button
          onClick={() => { sound.play("click"); rematch(); }}
          className="flex-1 px-3 py-2 rounded border border-gold/60 bg-gold/[0.08] hover:bg-gold/[0.15] text-gold-bright font-display tracking-[0.2em] text-[11px] uppercase transition"
        >
          {t.newTrial}
        </button>
        <button
          onClick={() => { sound.play("click"); reset(); }}
          className="px-3 py-2 rounded border border-papyrus/10 hover:border-papyrus/40 text-papyrus-dim hover:text-papyrus font-display tracking-[0.2em] text-[11px] uppercase transition"
        >
          {t.reset}
        </button>
      </div>

      {showAvaControls && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-2 overflow-hidden"
        >
          <div className="flex items-center justify-between gap-1.5">
            <button
              onClick={() => { sound.play("click"); setAutoPlay(!autoPlay); }}
              className={`flex-1 px-3 py-2 rounded text-[11px] font-display tracking-[0.2em] uppercase transition border ${
                autoPlay
                  ? "border-gold/60 bg-gold/[0.08] text-gold-bright"
                  : "border-papyrus/15 text-papyrus-dim hover:border-gold/40"
              }`}
            >
              {autoPlay ? t.pause : t.resume}
            </button>
            <button
              onClick={() => { sound.play("click"); stepAi(); }}
              disabled={autoPlay || result.status !== "playing"}
              className="px-3 py-2 rounded border border-papyrus/10 text-papyrus-dim hover:border-gold/40 hover:text-papyrus font-display tracking-[0.2em] text-[11px] uppercase transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.step}
            </button>
          </div>
          <label className="flex flex-col gap-1">
            <span className="font-display text-[10px] tracking-[0.25em] text-papyrus-dim uppercase">
              {t.speed}
            </span>
            <input
              type="range"
              min={120}
              max={2400}
              step={60}
              value={2520 - speedMs}
              onChange={(e) => setSpeedMs(2520 - Number(e.target.value))}
              aria-label={t.speed}
              aria-valuetext={`${speedMs} ms`}
              className="w-full"
            />
          </label>
        </motion.div>
      )}
    </div>
  );
}
