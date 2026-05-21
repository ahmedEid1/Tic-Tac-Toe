"use client";

import { useStrings } from "@/lib/i18n";

/**
 * Standard a11y skip-link. Hidden by default, visible when keyboard
 * users tab into the page so they can jump straight to the board
 * instead of tabbing through the utility bar + header.
 */
export default function SkipLink() {
  const t = useStrings();
  return (
    <a href="#game-board" className="skip-link">
      {t.skipToGame}
    </a>
  );
}
