"use client";

import { motion } from "framer-motion";
import { useStrings } from "@/lib/i18n";

export default function AlgorithmExplainer() {
  const t = useStrings();

  const sections = [
    { title: t.sectionMinimaxTitle, body: t.sectionMinimaxBody },
    { title: t.sectionWhyTitle,     body: t.sectionWhyBody },
    { title: t.sectionPruneTitle,   body: t.sectionPruneBody },
    { title: t.sectionFasterTitle,  body: t.sectionFasterBody },
  ];

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-10">
        <p className="font-display text-[10px] tracking-[0.45em] text-gold uppercase">
          {t.scrollTitle}
        </p>
        <h2 className="font-display text-3xl md:text-4xl gold-text mt-3">
          {t.scrollSubtitle}
        </h2>
        <div className="glyph-divider w-40 mx-auto mt-3" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <motion.article
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="papyrus rounded-lg p-5 leading-relaxed"
          >
            <h3 className="font-display text-base text-gold-bright tracking-wider mb-2">
              {section.title}
            </h3>
            <p className="text-papyrus/90 text-sm">{section.body}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-6 papyrus rounded-lg p-5">
        <h3 className="font-display text-sm text-gold-bright tracking-[0.25em] uppercase mb-3">
          {t.sectionTiersTitle}
        </h3>
        <ul className="space-y-2 text-sm text-papyrus/90">
          <li>{t.tierApprenticeLine}</li>
          <li>{t.tierScribeLine}</li>
          <li>{t.tierPharaohLine}</li>
        </ul>
      </div>

      <div className="mt-6 papyrus rounded-lg p-5">
        <h3 className="font-display text-sm text-gold-bright tracking-[0.25em] uppercase mb-3">
          {t.pseudocodeTitle}
        </h3>
        <pre
          dir="ltr"
          className="font-mono text-xs text-papyrus/85 leading-relaxed overflow-x-auto"
        >
{`function minimax(board, player, α, β):
  if board is terminal:
    return score(board)              # +10 / 0 / -10, adjusted for depth

  if it is the maximizer's turn:
    best ← -∞
    for each legal move m:
      v ← minimax(apply(board, m), opponent, α, β)
      best ← max(best, v)
      α ← max(α, v)
      if β ≤ α: break               # β-cutoff
    return best

  else (minimizer's turn):
    best ← +∞
    for each legal move m:
      v ← minimax(apply(board, m), opponent, α, β)
      best ← min(best, v)
      β ← min(β, v)
      if β ≤ α: break               # α-cutoff
    return best`}
        </pre>
      </div>
    </section>
  );
}
