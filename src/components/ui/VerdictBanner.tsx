"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { GlyphMark } from "./GlyphMark";

export default function VerdictBanner() {
  const result = useGameStore((s) => s.result);

  return (
    <AnimatePresence>
      {result.status !== "playing" && (
        <motion.div
          key={result.winner ?? "draw"}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.4 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 papyrus rounded-full px-6 py-2 flex items-center gap-3 gold-ring"
        >
          {result.winner ? (
            <>
              <GlyphMark player={result.winner} size={22} />
              <span className="font-display text-sm tracking-[0.3em] text-gold-bright uppercase">
                Glory to the {result.winner === "ankh" ? "Ankh" : "Eye"}
              </span>
            </>
          ) : (
            <span className="font-display text-sm tracking-[0.3em] text-turquoise uppercase">
              The Sands Are Even
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
