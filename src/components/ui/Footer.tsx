"use client";

import { useStrings } from "@/lib/i18n";

export default function Footer() {
  const t = useStrings();
  return (
    <footer className="relative z-10 text-center py-6 text-papyrus-dim text-xs italic border-t border-gold/10">
      {t.footer}
    </footer>
  );
}
