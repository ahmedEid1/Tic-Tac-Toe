"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { GlyphMark } from "./GlyphMark";

export default function Scoreboard() {
  const score = useGameStore((s) => s.score);
  const result = useGameStore((s) => s.result);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display text-[10px] tracking-[0.4em] text-gold uppercase">
        Scribe&apos;s Ledger
      </p>
      <div className="grid grid-cols-3 gap-2">
        <Tally label="Ankh">
          <ScoreNumber value={score.ankh} flash={result.winner === "ankh"} />
          <GlyphMark player="ankh" size={20} />
        </Tally>
        <Tally label="Draws">
          <ScoreNumber value={score.draws} flash={result.status === "draw"} />
          <span className="text-papyrus-dim text-base">∞</span>
        </Tally>
        <Tally label="Eye">
          <ScoreNumber value={score.eye} flash={result.winner === "eye"} />
          <GlyphMark player="eye" size={20} />
        </Tally>
      </div>
    </div>
  );
}

function Tally({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-2 rounded papyrus">
      <div className="flex items-center gap-2">{children}</div>
      <span className="font-display text-[9px] tracking-[0.3em] text-papyrus-dim uppercase">
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
        initial={{ opacity: 0, y: -10, scale: 0.6 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          color: flash ? "var(--color-gold-bright)" : "var(--color-papyrus)",
        }}
        exit={{ opacity: 0, y: 10, scale: 0.6 }}
        transition={{ duration: 0.4 }}
        className="font-display text-2xl"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
