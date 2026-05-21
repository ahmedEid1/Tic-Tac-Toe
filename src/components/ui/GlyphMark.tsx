/**
 * Inline 2D versions of the Ankh and Eye glyphs.
 * Used in UI chrome (mode buttons, scoreboard, tooltips). The 3D versions
 * live in components/game/ for the actual board pieces.
 */
import type { Player } from "@/lib/types";

interface GlyphMarkProps {
  player: Player;
  size?: number;
  className?: string;
}

export function GlyphMark({ player, size = 28, className }: GlyphMarkProps) {
  return player === "ankh" ? (
    <AnkhGlyph size={size} className={className} />
  ) : (
    <EyeGlyph size={size} className={className} />
  );
}

function AnkhGlyph({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 56"
      width={size}
      height={(size * 56) / 40}
      className={className}
      aria-label="Ankh"
    >
      <defs>
        <linearGradient id="gold-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffd966" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9d7c1f" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#gold-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      >
        <ellipse cx="20" cy="14" rx="9" ry="11" />
        <line x1="20" y1="25" x2="20" y2="52" />
        <line x1="6" y1="32" x2="34" y2="32" />
      </g>
    </svg>
  );
}

function EyeGlyph({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 56 40"
      width={size}
      height={(size * 40) / 56}
      className={className}
      aria-label="Eye of Horus"
    >
      <defs>
        <linearGradient id="lapis-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a78c2" />
          <stop offset="60%" stopColor="#1f4e8c" />
          <stop offset="100%" stopColor="#0e2a52" />
        </linearGradient>
        <linearGradient id="gold-grad-eye" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffd966" />
          <stop offset="100%" stopColor="#a3812b" />
        </linearGradient>
      </defs>
      {/* Eye almond */}
      <path
        d="M4 20 Q22 4 44 20 Q22 32 4 20 Z"
        fill="none"
        stroke="url(#gold-grad-eye)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Iris */}
      <circle cx="24" cy="20" r="6" fill="url(#lapis-grad)" />
      <circle cx="24" cy="20" r="2.2" fill="#0c0a08" />
      {/* Cheek mark (the long line down) */}
      <path
        d="M14 28 L22 36"
        stroke="url(#gold-grad-eye)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Spiral curl */}
      <path
        d="M34 28 Q40 34 36 38 Q32 40 34 36"
        stroke="url(#gold-grad-eye)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
