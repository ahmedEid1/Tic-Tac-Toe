"use client";

import { motion } from "framer-motion";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "The Minimax Algorithm",
    body: (
      <>
        The Pharaoh thinks not by intuition but by exhausting every possible
        future. From any position, it asks:{" "}
        <em>
          &ldquo;If I play here, what is the best my opponent can do? And what
          is my best reply after that? And theirs after that?&rdquo;
        </em>{" "}
        It descends to the end of every story and rates the ending:{" "}
        <span className="text-gold-bright">+10</span> for victory,{" "}
        <span className="text-blood-red">−10</span> for defeat,{" "}
        <span className="text-turquoise">0</span> for a draw. Then it walks back
        up the tree, alternately choosing the <em>best</em> score (on its turn)
        and assuming the opponent will choose the <em>worst</em> score (on
        theirs). That assumption — that the opponent plays perfectly — is the
        soul of minimax.
      </>
    ),
  },
  {
    title: "Why Tic-Tac-Toe?",
    body: (
      <>
        With only <strong>255,168</strong> distinct possible games, the entire
        decision tree fits in memory. Two perfect players always draw. That
        makes this ancient game the canonical training ground for the algorithm
        — small enough to fully solve, rich enough to teach the logic. Watch
        the node counter in the panel: even at the opening move, the Pharaoh
        evaluates thousands of positions before placing a single token.
      </>
    ),
  },
  {
    title: "Alpha-Beta Pruning",
    body: (
      <>
        The Pharaoh wastes no time. As it searches, it remembers{" "}
        <em>alpha</em> — the best score already guaranteed — and{" "}
        <em>beta</em> — the best score the opponent will permit. When a branch
        becomes worse than an alternative already considered, it stops:{" "}
        <em>that branch cannot change the answer.</em> Watch the dim{" "}
        <span className="italic">&ldquo;pruned&rdquo;</span> entries in the
        panel — the Pharaoh knew they were irrelevant before evaluating their
        children.
      </>
    ),
  },
  {
    title: "Winning Faster, Losing Slower",
    body: (
      <>
        A naive minimax thinks all wins are equal. The Pharaoh disagrees: a
        scored leaf is worth <span className="font-mono">10 − depth</span> for
        a win, <span className="font-mono">−10 + depth</span> for a loss. The
        consequence: when victory is certain, the Pharaoh chooses the{" "}
        <em>shortest</em> path to it. When defeat is inevitable, it{" "}
        <em>delays</em>, hoping the mortal will err. This is why an unbeatable
        AI can still feel <em>aggressive</em>.
      </>
    ),
  },
  {
    title: "The Three Tiers",
    body: (
      <ul className="space-y-1.5 list-none pl-0">
        <li>
          <span className="font-display text-gold tracking-wider">Apprentice</span>{" "}
          — no search at all. Picks at random. A first opponent for the
          student.
        </li>
        <li>
          <span className="font-display text-gold tracking-wider">Scribe</span>{" "}
          — minimax limited to <span className="font-mono">2 plies</span>.
          Sees danger but not the trap behind the trap.
        </li>
        <li>
          <span className="font-display text-gold tracking-wider">Pharaoh</span>{" "}
          — full minimax with alpha-beta and the faster-wins tiebreak. Never
          loses. Will exploit any imperfect play.
        </li>
      </ul>
    ),
  },
];

export default function AlgorithmExplainer() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-12">
        <p className="font-display text-[10px] tracking-[0.5em] text-gold uppercase">
          The Scroll of the Algorithm
        </p>
        <h2 className="font-display text-3xl md:text-4xl gold-text mt-3">
          How the Pharaoh Thinks
        </h2>
        <div className="glyph-divider w-48 mx-auto mt-4" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {SECTIONS.map((section, i) => (
          <motion.article
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="papyrus rounded-lg p-6 leading-relaxed"
          >
            <h3 className="font-display text-lg text-gold-bright tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="text-papyrus/90">{section.body}</div>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 papyrus rounded-lg p-6">
        <h3 className="font-display text-sm text-gold-bright tracking-[0.3em] uppercase mb-3">
          Pseudocode
        </h3>
        <pre className="font-mono text-xs text-papyrus/90 leading-relaxed overflow-x-auto">
{`function minimax(board, player, α, β):
  if board is terminal:
    return score(board)              # +10 / 0 / -10, adjusted for depth

  if it is the maximizer's turn:
    best ← -∞
    for each legal move m:
      v ← minimax(apply(board, m), opponent, α, β)
      best ← max(best, v)
      α ← max(α, v)
      if β ≤ α: break               # β-cutoff — opponent won't allow this
    return best

  else (minimizer's turn):
    best ← +∞
    for each legal move m:
      v ← minimax(apply(board, m), opponent, α, β)
      best ← min(best, v)
      β ← min(β, v)
      if β ≤ α: break               # α-cutoff — maximizer has a better line
    return best`}
        </pre>
      </div>
    </section>
  );
}
