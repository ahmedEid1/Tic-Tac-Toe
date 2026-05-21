/**
 * Compact inline mark for the Ankh / Eye of Horus — used in chips, scoreboard,
 * mode selectors. Wraps the authentic SVG glyphs.
 */
import { AnkhGlyph } from "@/components/glyphs/AnkhGlyph";
import { EyeOfHorusGlyph } from "@/components/glyphs/EyeOfHorusGlyph";
import type { Player } from "@/lib/types";

interface GlyphMarkProps {
  player: Player;
  size?: number;
  className?: string;
}

export function GlyphMark({ player, size = 22, className }: GlyphMarkProps) {
  if (player === "ankh") {
    return (
      <span
        className={`inline-flex items-center justify-center text-gold ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        <AnkhGlyph className="h-full w-auto" />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size * 1.3, height: size }}
    >
      <EyeOfHorusGlyph
        className="h-full w-auto"
        accent="var(--color-lapis)"
        light="var(--color-papyrus-dim)"
      />
    </span>
  );
}
