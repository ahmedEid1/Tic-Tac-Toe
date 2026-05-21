"use client";

import { motion } from "framer-motion";
import { useStrings } from "@/lib/i18n";

export default function Header() {
  const t = useStrings();
  return (
    <header className="relative z-10 flex flex-col items-center pt-10 pb-6 text-center px-4">
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display tracking-[0.45em] text-[10px] text-gold/90 uppercase"
      >
        {t.eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-display text-4xl md:text-6xl font-semibold tracking-wide gold-text mt-2"
      >
        {t.title}
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="glyph-divider w-56 mt-4 origin-center"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-4 max-w-2xl text-papyrus-dim italic text-sm md:text-base leading-relaxed"
      >
        {t.subtitle}
      </motion.p>
    </header>
  );
}
