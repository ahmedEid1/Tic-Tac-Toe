"use client";

import { useGameStore } from "@/store/gameStore";
import { sound } from "@/lib/sound";
import { GlyphMark } from "./GlyphMark";
import type { Difficulty, Player } from "@/lib/types";

const TIERS: { value: Difficulty; label: string; sub: string }[] = [
  { value: "apprentice", label: "Apprentice", sub: "random scribe" },
  { value: "scribe", label: "Scribe", sub: "shallow foresight" },
  { value: "pharaoh", label: "Pharaoh", sub: "unbeatable" },
];

function PlayerTierSelector({ player }: { player: Player }) {
  const config = useGameStore((s) => s[player]);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  if (!config.isAi) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-papyrus-dim text-xs">
        <GlyphMark player={player} size={16} />
        <span className="font-display tracking-[0.25em] uppercase text-[10px]">
          {player === "ankh" ? "Ankh AI" : "Eye AI"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {TIERS.map((tier) => {
          const active = config.difficulty === tier.value;
          return (
            <button
              key={tier.value}
              onClick={() => {
                sound.play("click");
                setDifficulty(player, tier.value);
              }}
              className={`px-2 py-1.5 rounded text-[11px] font-display tracking-wider transition border ${
                active
                  ? "border-gold bg-gold/15 text-gold-bright"
                  : "border-papyrus/15 text-papyrus-dim hover:border-gold/40"
              }`}
              title={tier.sub}
            >
              {tier.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DifficultySelector() {
  const mode = useGameStore((s) => s.mode);
  const ankh = useGameStore((s) => s.ankh);
  const eye = useGameStore((s) => s.eye);
  const anyAi = ankh.isAi || eye.isAi;
  if (!anyAi) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-[10px] tracking-[0.4em] text-gold uppercase">
        Wisdom of the AI
      </p>
      <PlayerTierSelector player="ankh" />
      <PlayerTierSelector player="eye" />
      {mode === "ava" && (
        <p className="text-[11px] italic text-papyrus-dim leading-tight">
          Two Pharaohs always draw — pair Pharaoh with Apprentice or Scribe to
          see real combat.
        </p>
      )}
    </div>
  );
}
