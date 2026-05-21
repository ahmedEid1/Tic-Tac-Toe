"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useStrings } from "@/lib/i18n";
import { GlyphMark } from "./GlyphMark";

export default function Scoreboard() {
  const t = useStrings();
  const score = useGameStore((s) => s.score);
  const result = useGameStore((s) => s.result);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display text-[10px] tracking-[0.35em] text-gold uppercase">
        {t.ledger}
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        <Tally label={t.ankh}>
          <ScoreNumber value={score.ankh} flash={result.winner === "ankh"} />
          <GlyphMark player="ankh" size={18} />
        </Tally>
        <Tally label={t.draws}>
          <ScoreNumber value={score.draws} flash={result.status === "draw"} />
          <span className="text-papyrus-dim text-sm">∞</span>
        </Tally>
        <Tally label={t.eye}>
          <ScoreNumber value={score.eye} flash={result.winner === "eye"} />
          <GlyphMark player="eye" size={18} />
        </Tally>
      </div>
    </div>
  );
}

function Tally({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2 px-1 rounded border border-papyrus/10 bg-kohl/30">
      <div className="flex items-center gap-1.5">{children}</div>
      <span className="font-display text-[9px] tracking-[0.2em] text-papyrus-dim uppercase">
        {label}
      </span>
    </div>
  );
}

function ScoreNumber({ value, flash }: { value: number; flash: boolean }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8, scale: 0.7 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          color: flash ? "var(--color-gold-bright)" : "var(--color-papyrus)",
        }}
        exit={{ opacity: 0, y: 8, scale: 0.7 }}
        transition={{ duration: 0.35 }}
        className="font-display text-xl"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
