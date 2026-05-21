"use client";

import { useGameStore } from "@/store/gameStore";
import { useStrings } from "@/lib/i18n";
import { sound } from "@/lib/sound";
import { GlyphMark } from "./GlyphMark";
import type { Mode } from "@/lib/types";

export default function ModeSelector() {
  const t = useStrings();
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);

  const options: { value: Mode; label: string; sub: string }[] = [
    { value: "hvh", label: t.modeHvh, sub: t.modeHvhSub },
    { value: "hva", label: t.modeHva, sub: t.modeHvaSub },
    { value: "ava", label: t.modeAva, sub: t.modeAvaSub },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display text-[10px] tracking-[0.35em] text-gold uppercase">
        {t.chooseTrial}
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {options.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => {
                sound.play("click");
                setMode(opt.value);
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-start transition border ${
                active
                  ? "border-gold/70 bg-gold/[0.08]"
                  : "border-papyrus/10 hover:border-gold/40 hover:bg-papyrus/[0.02]"
              }`}
              aria-pressed={active}
            >
              <div className="flex items-center gap-1.5 opacity-90 shrink-0">
                <GlyphMark player="ankh" size={16} />
                <span className="text-papyrus-dim text-[10px]">{t.versus}</span>
                <GlyphMark player="eye" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-display text-sm leading-tight ${active ? "text-gold-bright" : "text-papyrus"}`}>
                  {opt.label}
                </div>
                <div className="text-[11px] text-papyrus-dim italic leading-tight mt-0.5">
                  {opt.sub}
                </div>
              </div>
              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
