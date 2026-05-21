"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";
import { useStrings } from "@/lib/i18n";

export default function SoundToggle() {
  const t = useStrings();
  const [muted, setMuted] = useState(false);
  return (
    <button
      onClick={() => {
        const next = sound.toggleMute();
        setMuted(next);
        if (!next) sound.play("click");
      }}
      aria-label={muted ? t.muteOn : t.muteOff}
      aria-pressed={muted}
      title={muted ? t.muteOn : t.muteOff}
      className="h-8 w-8 rounded-full border border-papyrus/15 hover:border-gold/50 text-papyrus-dim hover:text-gold-bright transition flex items-center justify-center"
    >
      {muted ? (
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
