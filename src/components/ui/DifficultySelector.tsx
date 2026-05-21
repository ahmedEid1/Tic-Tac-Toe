"use client";

import { useGameStore } from "@/store/gameStore";
import { useStrings } from "@/lib/i18n";
import { sound } from "@/lib/sound";
import { GlyphMark } from "./GlyphMark";
import type { Difficulty, Player } from "@/lib/types";

function PlayerTierSelector({ player }: { player: Player }) {
  const t = useStrings();
  const config = useGameStore((s) => s[player]);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  if (!config.isAi) return null;

  const tiers: { value: Difficulty; label: string; sub: string }[] = [
    { value: "apprentice", label: t.diffApprentice, sub: t.diffApprenticeSub },
    { value: "scribe",     label: t.diffScribe,     sub: t.diffScribeSub },
    { value: "pharaoh",    label: t.diffPharaoh,    sub: t.diffPharaohSub },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-papyrus-dim text-xs">
        <GlyphMark player={player} size={14} />
        <span className="font-display tracking-[0.2em] uppercase text-[10px]">
          {player === "ankh" ? t.ankhAi : t.eyeAi}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {tiers.map((tier) => {
          const active = config.difficulty === tier.value;
          return (
            <button
              key={tier.value}
              onClick={() => {
                sound.play("click");
                setDifficulty(player, tier.value);
              }}
              className={`px-1.5 py-1.5 rounded text-[10px] font-display tracking-wider transition border leading-tight ${
                active
                  ? "border-gold/70 bg-gold/[0.10] text-gold-bright"
                  : "border-papyrus/10 text-papyrus-dim hover:border-gold/40"
              }`}
              title={tier.sub}
              aria-pressed={active}
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
  const t = useStrings();
  const mode = useGameStore((s) => s.mode);
  const ankhIsAi = useGameStore((s) => s.ankh.isAi);
  const eyeIsAi = useGameStore((s) => s.eye.isAi);
  if (!ankhIsAi && !eyeIsAi) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-display text-[10px] tracking-[0.35em] text-gold uppercase">
        {t.aiWisdom}
      </p>
      <PlayerTierSelector player="ankh" />
      <PlayerTierSelector player="eye" />
      {mode === "ava" && (
        <p className="text-[11px] italic text-papyrus-dim leading-snug">
          {t.pharaohWarning}
        </p>
      )}
    </div>
  );
}
