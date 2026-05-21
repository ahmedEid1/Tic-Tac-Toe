"use client";

import { motion } from "framer-motion";
import { AnkhGlyph } from "@/components/glyphs/AnkhGlyph";
import { EyeOfHorusGlyph } from "@/components/glyphs/EyeOfHorusGlyph";
import type { Player } from "@/lib/types";

interface PieceTokenProps {
  player: Player;
  highlighted?: boolean;
  className?: string;
}

/**
 * The full-size token rendered inside a board cell. Animates in with a
 * spring scale + subtle rise.
 */
export function PieceToken({ player, highlighted, className }: PieceTokenProps) {
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={`flex h-full w-full items-center justify-center ${className ?? ""}`}
    >
      {player === "ankh" ? (
        <AnkhGlyph
          className={`h-[78%] w-auto drop-shadow-[0_4px_10px_rgba(212,175,55,0.35)] ${highlighted ? "text-gold-bright" : "text-gold"}`}
        />
      ) : (
        <EyeOfHorusGlyph
          className={`w-[78%] h-auto drop-shadow-[0_4px_10px_rgba(31,78,140,0.4)]`}
          accent={highlighted ? "var(--color-gold-bright)" : "var(--color-lapis)"}
          light="var(--color-papyrus-dim)"
        />
      )}
    </motion.div>
  );
}
