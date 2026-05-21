"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative z-10 flex flex-col items-center pt-12 pb-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-display tracking-[0.5em] text-[10px] text-gold uppercase"
      >
        A Trial of the Mind
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="font-display text-5xl md:text-6xl font-semibold tracking-wide gold-text mt-2"
      >
        Pharaoh&apos;s Gambit
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="glyph-divider w-72 mt-4 origin-center"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-4 max-w-xl text-papyrus-dim italic"
      >
        Three in a row was once etched in temple sand. Today, the same game
        teaches a machine to think. Stand before the board — and watch the
        Pharaoh reason.
      </motion.p>
    </header>
  );
}
