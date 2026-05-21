"use client";

import { useEffect } from "react";
import { isRtl, useLocaleStore } from "@/lib/i18n";

/**
 * Syncs <html lang/dir> with the current locale from the Zustand store.
 * Rendered once near the root so language changes immediately reflect on
 * the document element — required for native :lang() / [dir] selectors.
 */
export default function LocaleEffect() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
