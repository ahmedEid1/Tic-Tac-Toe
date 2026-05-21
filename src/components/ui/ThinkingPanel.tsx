"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { otherPlayer } from "@/lib/game";
import { GlyphMark } from "./GlyphMark";
import type { MinimaxNode, Player } from "@/lib/types";

const CELL_LABEL = [
  "NW", "N", "NE",
  "W",  "C", "E",
  "SW", "S", "SE",
];

/**
 * Reduces a child list to a manageable display set:
 * sorts by score desc (for max) / asc (for min), keeps top N + pruned summary.
 */
function summarizeChildren(
  children: MinimaxNode[],
  maximizing: boolean,
  topN: number,
): { shown: MinimaxNode[]; prunedCount: number } {
  const real = children.filter((c) => !c.isPruned);
  const pruned = children.filter((c) => !!c.isPruned);
  const sorted = [...real].sort((a, b) =>
    maximizing ? b.score - a.score : a.score - b.score,
  );
  return { shown: sorted.slice(0, topN), prunedCount: pruned.length };
}

function scoreColor(score: number): string {
  if (Number.isNaN(score)) return "text-papyrus-dim/40";
  if (score > 0) return "text-gold-bright";
  if (score < 0) return "text-blood-red";
  return "text-turquoise";
}

function ScorePill({ score }: { score: number }) {
  if (Number.isNaN(score)) return <span className="text-papyrus-dim/40 text-xs">—</span>;
  const sign = score > 0 ? "+" : "";
  return (
    <span className={`font-mono text-xs ${scoreColor(score)}`}>
      {sign}
      {score}
    </span>
  );
}

function MoveNode({
  node,
  rootMaximizing,
  level,
}: {
  node: MinimaxNode;
  rootMaximizing: Player;
  level: number;
}) {
  if (node.move === null) return null;
  const playedBy: Player =
    level % 2 === 1 ? rootMaximizing : otherPlayer(rootMaximizing);
  const isChosen = node.isChosen;
  const isPruned = node.isPruned;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: isPruned ? 0.35 : 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative flex flex-col gap-1 pl-3 border-l ${
        isChosen
          ? "border-gold"
          : isPruned
            ? "border-papyrus/10 border-dashed"
            : "border-papyrus/20"
      }`}
    >
      <div
        className={`flex items-center gap-2 py-1 pr-2 rounded text-xs ${
          isChosen ? "bg-gold/10" : ""
        }`}
      >
        <GlyphMark player={playedBy} size={14} />
        <span className="font-display tracking-wider text-papyrus-dim">
          {CELL_LABEL[node.move]}
        </span>
        <span className="flex-1" />
        <ScorePill score={node.score} />
        {isChosen && (
          <span className="font-display text-[9px] tracking-[0.3em] text-gold-bright uppercase">
            chosen
          </span>
        )}
        {isPruned && (
          <span className="font-display text-[9px] tracking-[0.3em] text-papyrus-dim/60 uppercase italic">
            pruned
          </span>
        )}
      </div>
      {!isPruned && level < 2 && node.children.length > 0 && (
        <ChildList
          nodes={node.children}
          rootMaximizing={rootMaximizing}
          level={level + 1}
        />
      )}
    </motion.div>
  );
}

function ChildList({
  nodes,
  rootMaximizing,
  level,
}: {
  nodes: MinimaxNode[];
  rootMaximizing: Player;
  level: number;
}) {
  // At level 1+, "current player to move" alternates. At top of recursion the
  // root has the maximizing player to move, so its children are opponent moves.
  const playerToMoveBeforeChildren: Player =
    level % 2 === 0 ? rootMaximizing : otherPlayer(rootMaximizing);
  const maximizing = playerToMoveBeforeChildren === rootMaximizing;
  const topN = level === 1 ? 9 : 3;
  const { shown, prunedCount } = summarizeChildren(nodes, maximizing, topN);

  return (
    <div className="flex flex-col gap-0.5 ml-2 my-1">
      {shown.map((c, i) => (
        <MoveNode
          key={`${c.move}-${i}`}
          node={c}
          rootMaximizing={rootMaximizing}
          level={level}
        />
      ))}
      {prunedCount > 0 && (
        <div className="pl-3 text-[10px] font-mono text-papyrus-dim/50 italic">
          +{prunedCount} pruned by α-β
        </div>
      )}
    </div>
  );
}

export default function ThinkingPanel() {
  const trace = useGameStore((s) => s.lastAiTrace);
  const aiThinking = useGameStore((s) => s.aiThinking);

  return (
    <div className="papyrus rounded-xl p-5 flex flex-col gap-3 h-full overflow-hidden">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-display text-[10px] tracking-[0.4em] text-gold uppercase">
            The Pharaoh Contemplates
          </p>
          <p className="text-papyrus-dim italic text-xs mt-1">
            Every move evaluated. Every reply foreseen.
          </p>
        </div>
        {trace && (
          <div className="text-right font-mono text-[10px] text-papyrus-dim leading-tight">
            <div>{trace.nodesEvaluated.toLocaleString()} nodes</div>
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
            <div className="text-papyrus-dim italic shimmer">
              Reading the future…
            </div>
          </motion.div>
        )}

        {!trace && !aiThinking && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center text-center px-6"
          >
            <p className="text-papyrus-dim italic text-sm">
              When the AI takes a turn, its full decision tree will appear here
              — every considered move and its rated future.
            </p>
          </motion.div>
        )}

        {trace && (
          <motion.div
            key={trace.elapsedMs + "-" + trace.nodesEvaluated}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto pr-1"
          >
            <p className="font-display text-[10px] tracking-[0.3em] text-papyrus-dim uppercase mb-2">
              Candidate moves &mdash; score is the guaranteed outcome
            </p>
            <ChildList
              nodes={trace.tree.children}
              rootMaximizing={trace.tree.player}
              level={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-[10px] text-papyrus-dim/70 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gold" /> chosen
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blood-red" /> losing
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-turquoise" /> drawing
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gold-bright" /> winning
        </span>
      </div>
    </div>
  );
}
