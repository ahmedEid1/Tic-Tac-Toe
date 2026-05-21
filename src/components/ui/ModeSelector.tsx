"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { GlyphMark } from "./GlyphMark";
import { sound } from "@/lib/sound";
import type { Mode } from "@/lib/types";

interface Option {
  value: Mode;
  label: string;
  sub: string;
  left: "ankh" | "eye";
  right: "ankh" | "eye";
}

const OPTIONS: Option[] = [
  {
    value: "hvh",
    label: "Mortal vs Mortal",
    sub: "Two players, one board",
    left: "ankh",
    right: "eye",
  },
  {
    value: "hva",
    label: "Mortal vs Pharaoh",
    sub: "You play the Ankh",
    left: "ankh",
    right: "eye",
  },
  {
    value: "ava",
    label: "Trial of the Gods",
    sub: "Watch the AI face itself",
    left: "ankh",
    right: "eye",
  },
];

export default function ModeSelector() {
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display text-[10px] tracking-[0.4em] text-gold uppercase">
        Choose the Trial
      </p>
      <div className="grid grid-cols-1 gap-2">
        {OPTIONS.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => {
                sound.play("click");
                setMode(opt.value);
              }}
              className={`relative group flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border ${
                active
                  ? "border-gold bg-gold/10 gold-ring"
                  : "border-papyrus/15 hover:border-gold/50 hover:bg-papyrus/5"
              }`}
            >
              <div className="flex items-center gap-1.5 opacity-90">
                <GlyphMark player={opt.left} size={20} />
                <span className="text-papyrus-dim text-xs">vs</span>
                <GlyphMark player={opt.right} size={20} />
              </div>
              <div className="flex-1">
                <div
                  className={`font-display text-sm tracking-wider ${active ? "text-gold-bright" : "text-papyrus"}`}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-papyrus-dim italic">{opt.sub}</div>
              </div>
              {active && (
                <motion.div
                  layoutId="mode-pip"
                  className="h-2 w-2 rounded-full bg-gold shimmer"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
