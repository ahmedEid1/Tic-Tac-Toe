"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { sound } from "@/lib/sound";

export default function GameControls() {
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
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={() => {
            sound.play("click");
            rematch();
          }}
          className="flex-1 px-3 py-2 rounded border border-gold/60 bg-gold/10 hover:bg-gold/20 text-gold-bright font-display tracking-[0.2em] text-xs uppercase transition"
        >
          New Trial
        </button>
        <button
          onClick={() => {
            sound.play("click");
            reset();
          }}
          className="px-3 py-2 rounded border border-papyrus/15 hover:border-papyrus/40 text-papyrus-dim hover:text-papyrus font-display tracking-[0.2em] text-xs uppercase transition"
          title="Reset ledger and board"
        >
          Reset
        </button>
      </div>

      {showAvaControls && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-2 overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                sound.play("click");
                setAutoPlay(!autoPlay);
              }}
              className={`flex-1 px-3 py-2 rounded text-xs font-display tracking-[0.2em] uppercase transition border ${
                autoPlay
                  ? "border-gold/60 bg-gold/10 text-gold-bright"
                  : "border-papyrus/20 text-papyrus-dim hover:border-gold/40"
              }`}
            >
              {autoPlay ? "Pause" : "Resume"}
            </button>
            <button
              onClick={() => {
                sound.play("click");
                stepAi();
              }}
              disabled={autoPlay || result.status !== "playing"}
              className="px-3 py-2 rounded border border-papyrus/15 text-papyrus-dim hover:border-gold/40 hover:text-papyrus font-display tracking-[0.2em] text-xs uppercase transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Step
            </button>
          </div>
          <label className="flex flex-col gap-1">
            <span className="font-display text-[10px] tracking-[0.3em] text-papyrus-dim uppercase">
              Speed
            </span>
            <input
              type="range"
              min={120}
              max={2400}
              step={60}
              value={2520 - speedMs}
              onChange={(e) => setSpeedMs(2520 - Number(e.target.value))}
              aria-label="AI move speed"
              aria-valuetext={`${speedMs} ms between moves`}
              className="accent-[var(--color-gold)]"
            />
          </label>
        </motion.div>
      )}
    </div>
  );
}
