"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { describeOutcome, useStrings } from "@/lib/i18n";
import { AnkhGlyph } from "@/components/glyphs/AnkhGlyph";
import { EyeOfHorusGlyph } from "@/components/glyphs/EyeOfHorusGlyph";
import type { Board, MinimaxNode, Player } from "@/lib/types";

/**
 * A small 3×3 board diagram showing the board state with one cell highlighted
 * as the AI's hypothetical move. Used inside each candidate-move card so the
 * viewer can see *where* the AI would play, not just an abstract score.
 */
function MiniBoard({
  board,
  highlight,
  highlightPlayer,
}: {
  board: Board;
  highlight: number;
  highlightPlayer: Player;
}) {
  return (
    <div className="grid grid-cols-3 gap-[2px] w-14 h-14 shrink-0">
      {board.map((cell, i) => {
        const isHi = i === highlight;
        return (
          <div
            key={i}
            className={`relative rounded-[2px] flex items-center justify-center ${
              isHi
                ? "bg-gold/30 ring-1 ring-gold-bright"
                : "bg-papyrus/[0.06]"
            }`}
          >
            {cell === "ankh" && (
              <AnkhGlyph className="w-3 h-3 text-gold-bright" />
            )}
            {cell === "eye" && (
              <EyeOfHorusGlyph
                className="w-3 h-3"
                accent="var(--color-lapis)"
                light="transparent"
              />
            )}
            {isHi && cell === null && (
              <>
                {highlightPlayer === "ankh" ? (
                  <AnkhGlyph className="w-3.5 h-3.5 text-gold-bright" />
                ) : (
                  <EyeOfHorusGlyph
                    className="w-3.5 h-3.5"
                    accent="var(--color-gold-bright)"
                    light="transparent"
                  />
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ScoreToken {
  tone: "win" | "lose" | "draw";
  text: string;
  value: number;
}

function scoreToken(score: number, outcome: string): ScoreToken {
  if (Number.isNaN(score)) return { tone: "draw", text: "—", value: 0 };
  return {
    value: score,
    text: outcome,
    tone: score > 0 ? "win" : score < 0 ? "lose" : "draw",
  };
}

function CandidateCard({
  node,
  board,
  player,
  rank,
}: {
  node: MinimaxNode;
  board: Board;
  player: Player;
  rank: number;
}) {
  const t = useStrings();
  if (node.move === null) return null;
  if (node.isPruned) return null;

  const token = scoreToken(node.score, describeOutcome(t, node.score));
  const isChosen = !!node.isChosen;

  const toneClass =
    token.tone === "win"
      ? "text-gold-bright"
      : token.tone === "lose"
        ? "text-blood-red"
        : "text-turquoise";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.04 }}
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isChosen
          ? "border-gold/60 bg-gold/[0.06]"
          : "border-papyrus/10 bg-kohl/30"
      }`}
    >
      <MiniBoard board={board} highlight={node.move} highlightPlayer={player} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className={`font-display text-sm tracking-wider ${isChosen ? "text-gold-bright" : "text-papyrus"}`}>
            {String.fromCharCode(65 + rank)}
          </span>
          {isChosen && (
            <span className="font-display text-[9px] tracking-[0.3em] text-gold-bright uppercase">
              ★ {t.chosen}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`font-mono text-sm ${toneClass}`}>
            {token.value > 0 ? "+" : ""}
            {token.value}
          </span>
          <span className="text-[11px] text-papyrus-dim">
            · {token.text}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ThinkingPanel() {
  const t = useStrings();
  const trace = useGameStore((s) => s.lastAiTrace);
  const aiThinking = useGameStore((s) => s.aiThinking);
  const board = useGameStore((s) => s.board);

  // The trace is for the board *before* the AI's chosen move was applied.
  // Reconstruct that board by undoing the last move *if* trace exists and
  // the chosen move now appears on the board.
  const traceBoard: Board = (() => {
    if (!trace) return board;
    const moved = trace.bestMove;
    if (
      moved !== undefined &&
      moved >= 0 &&
      board[moved] !== null
    ) {
      // The AI already placed → step back one to reconstruct.
      const before = board.slice();
      before[moved] = null;
      return before;
    }
    return board;
  })();

  return (
    <div className="papyrus rounded-xl p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] tracking-[0.35em] text-gold uppercase">
            {t.thinkingTitle}
          </p>
          <p className="text-papyrus-dim italic text-xs mt-1 leading-snug">
            {t.thinkingSub}
          </p>
        </div>
        {trace && (
          <div className="text-end font-mono text-[10px] text-papyrus-dim leading-tight shrink-0">
            <div>
              {trace.nodesEvaluated.toLocaleString()} {t.nodes}
            </div>
            <div>{trace.elapsedMs.toFixed(1)} ms</div>
          </div>
        )}
      </div>

      <div className="glyph-divider" />

      <AnimatePresence mode="wait">
        {aiThinking && !trace && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center text-center"
          >
            <div className="text-papyrus-dim italic shimmer text-sm">
              {t.thinkingWaiting}
            </div>
          </motion.div>
        )}

        {!trace && !aiThinking && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center text-center px-2"
          >
            <p className="text-papyrus-dim italic text-sm leading-relaxed">
              {t.thinkingIdle}
            </p>
          </motion.div>
        )}

        {trace && (
          <motion.div
            key={trace.elapsedMs + "-" + trace.nodesEvaluated}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto pe-1"
          >
            <p className="font-display text-[10px] tracking-[0.25em] text-papyrus-dim uppercase mb-1">
              {t.candidateMoves}
            </p>
            <p className="text-[11px] text-papyrus-dim italic mb-3 leading-snug">
              {t.candidateExplain}
            </p>
            <div className="flex flex-col gap-2">
              {trace.tree.children
                .filter((c) => c.move !== null && !c.isPruned)
                .sort((a, b) => b.score - a.score)
                .map((node, i) => (
                  <CandidateCard
                    key={node.move ?? i}
                    node={node}
                    board={traceBoard}
                    player={trace.tree.player}
                    rank={i}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
