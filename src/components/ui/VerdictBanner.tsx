"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useStrings } from "@/lib/i18n";
import { GlyphMark } from "./GlyphMark";

export default function VerdictBanner() {
  const t = useStrings();
  const result = useGameStore((s) => s.result);

  return (
    <AnimatePresence>
      {result.status !== "playing" && (
        <motion.div
          key={result.winner ?? "draw"}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 papyrus rounded-full px-5 py-2 flex items-center gap-3 gold-ring whitespace-nowrap"
        >
          {result.winner ? (
            <>
              <GlyphMark player={result.winner} size={20} />
              <span className="font-display text-xs tracking-[0.25em] text-gold-bright uppercase">
                {result.winner === "ankh" ? t.gloryToAnkh : t.gloryToEye}
              </span>
            </>
          ) : (
            <span className="font-display text-xs tracking-[0.25em] text-turquoise uppercase">
              {t.sandsAreEven}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
