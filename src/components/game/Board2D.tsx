"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useStrings } from "@/lib/i18n";
import { PieceToken } from "./PieceToken";
import type { Player } from "@/lib/types";

/**
 * The flat, top-down board. A 3×3 grid drawn as a calm papyrus surface
 * with a subtle stone frame. Each empty cell shows the AI's minimax score
 * for that move (if a trace is available) and hover lights up the cell.
 */
export default function Board2D() {
  const board = useGameStore((s) => s.board);
  const playerMove = useGameStore((s) => s.playerMove);
  const aiThinking = useGameStore((s) => s.aiThinking);
  const result = useGameStore((s) => s.result);
  const turn = useGameStore((s) => s.turn);
  const turnIsAi = useGameStore((s) => s[s.turn].isAi);
  const trace = useGameStore((s) => s.lastAiTrace);
  const t = useStrings();

  const winLine = result.line;
  const interactable = result.status === "playing" && !aiThinking && !turnIsAi;

  return (
    <div className="relative w-full max-w-[560px] flex flex-col gap-3">
      {/* Turn indicator — lives ABOVE the board, never overlaps cells */}
      <div className="flex items-center justify-between h-5 px-1">
        <AnimatePresence mode="wait">
          {result.status === "playing" && (
            <motion.div
              key={turn}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="font-display text-[10px] tracking-[0.35em] text-papyrus-dim uppercase flex items-center gap-2"
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-gold shimmer"
                aria-hidden
              />
              <span>{turn === "ankh" ? t.ankh : t.eye}</span>
              <span className="text-papyrus-dim/60 text-[10px]">{t.toMove}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Board */}
      <div className="relative w-full aspect-square">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-papyrus/[0.06] to-lapis/[0.04] border border-gold/30 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]" />
        <div className="relative grid grid-cols-3 grid-rows-3 gap-2 p-5 h-full">
          {board.map((cell, i) => (
            <Cell
              key={i}
              index={i}
              value={cell}
              score={trace?.candidateScores?.[i]}
              isWinning={!!winLine && winLine.includes(i as 0)}
              interactable={interactable && cell === null}
              nextPlayer={turn}
              onPlay={() => playerMove(i)}
            />
          ))}
          {winLine && <WinStroke line={winLine as [number, number, number]} />}
        </div>
      </div>
    </div>
  );
}

interface CellProps {
  index: number;
  value: Player | null;
  score: number | undefined;
  isWinning: boolean;
  interactable: boolean;
  nextPlayer: Player;
  onPlay: () => void;
}

function Cell({
  index,
  value,
  score,
  isWinning,
  interactable,
  nextPlayer,
  onPlay,
}: CellProps) {
  const showScore = score !== undefined && value === null;

  return (
    <button
      onClick={onPlay}
      disabled={!interactable}
      aria-disabled={!interactable}
      aria-label={`Cell ${["NW","N","NE","W","C","E","SW","S","SE"][index]}`}
      data-cell={index}
      className={`group relative rounded-xl border transition-colors duration-300 ${
        isWinning
          ? "border-gold-bright bg-gold/15"
          : "border-papyrus/15 bg-kohl/40"
      } ${interactable ? "cursor-pointer hover:border-gold/60 hover:bg-papyrus/[0.04]" : "cursor-default"} disabled:opacity-100`}
    >
      {/* Score pill (visible only when empty + AI has thought) */}
      {showScore && <ScoreBadge score={score} />}

      {/* Hover ghost — what the next move would look like */}
      {value === null && interactable && (
        <div className="pointer-events-none absolute inset-3 opacity-0 group-hover:opacity-30 transition-opacity">
          <PieceToken player={nextPlayer} />
        </div>
      )}

      {/* The placed token */}
      {value && (
        <div className="absolute inset-3">
          <PieceToken player={value} highlighted={isWinning} />
        </div>
      )}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const cls = useMemo(() => {
    if (score > 0) return "text-gold-bright border-gold/50 bg-gold/10";
    if (score < 0) return "text-blood-red/90 border-blood-red/40 bg-blood-red/10";
    return "text-turquoise border-turquoise/40 bg-turquoise/10";
  }, [score]);
  const sign = score > 0 ? "+" : "";
  return (
    <div
      className={`absolute top-2 ltr:right-2 rtl:left-2 font-mono text-[10px] px-1.5 py-0.5 rounded border ${cls}`}
    >
      {sign}
      {score}
    </div>
  );
}

const CELL_SIZE_PCT = (1 / 3) * 100;

/** Glowing brush stroke across the winning trio. */
function WinStroke({ line }: { line: [number, number, number] }) {
  const [a, , c] = line;
  const center = (idx: number) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    return {
      x: col * CELL_SIZE_PCT + CELL_SIZE_PCT / 2,
      y: row * CELL_SIZE_PCT + CELL_SIZE_PCT / 2,
    };
  };
  const p1 = center(a);
  const p2 = center(c);

  return (
    <svg
      className="pointer-events-none absolute inset-5"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="winstroke" x1="0" x2="100%" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-gold-bright)" />
          <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="url(#winstroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 6px rgba(255,217,102,0.6))" }}
      />
    </svg>
  );
}
