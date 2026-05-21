/**
 * Subtle SVG layer of repeating hieroglyph-like sigils behind everything.
 * Pure CSS/SVG; no images. Sits absolutely-positioned, very low opacity.
 */
export default function HieroglyphBackground() {
  // A handful of stylized glyph shapes — eye, ankh, sun, scarab, feather, snake.
  // These are abstracted; intent is "ancient marks", not literal hieroglyphs.
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-[0.07]"
    >
      <defs>
        <pattern
          id="glyphs"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          {/* Ankh */}
          <g
            transform="translate(20 20)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="10" cy="6" r="5" />
            <line x1="10" y1="11" x2="10" y2="26" />
            <line x1="3" y1="16" x2="17" y2="16" />
          </g>
          {/* Eye */}
          <g
            transform="translate(80 30)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M0 8 Q12 -2 24 8 Q12 18 0 8 Z" />
            <circle cx="12" cy="8" r="3" fill="currentColor" />
            <path d="M5 16 L10 20" />
            <path d="M19 16 Q22 22 16 22" />
          </g>
          {/* Sun disk */}
          <g
            transform="translate(120 90)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="8" r="6" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </g>
          {/* Feather */}
          <g
            transform="translate(30 90)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 22 Q-2 12 5 0 Q12 12 5 22 Z" />
            <line x1="5" y1="22" x2="5" y2="30" />
          </g>
          {/* Wavy snake */}
          <path
            d="M70 130 Q80 120 90 130 T110 130 T130 130"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#glyphs)"
        color="var(--color-gold)"
      />
    </svg>
  );
}
