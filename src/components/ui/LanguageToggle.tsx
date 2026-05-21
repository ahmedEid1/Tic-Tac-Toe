"use client";

import { useLocaleStore, useStrings } from "@/lib/i18n";

/** Pill toggle: shows the *other* language's name so it reads as the action. */
export default function LanguageToggle() {
  const t = useStrings();
  const toggle = useLocaleStore((s) => s.toggle);
  const locale = useLocaleStore((s) => s.locale);

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${t.langToggle}`}
      className="font-display tracking-[0.2em] text-[11px] uppercase px-3 py-1.5 rounded-full border border-papyrus/15 hover:border-gold/60 hover:text-gold-bright transition text-papyrus-dim"
    >
      {/* Display the other language's label */}
      <span lang={locale === "en" ? "ar" : "en"}>{t.langToggle}</span>
    </button>
  );
}
