import { applyMove, evaluate, otherPlayer, validMoves } from "./game";
import type {
  Board,
  Difficulty,
  MinimaxNode,
  MinimaxResult,
  Player,
} from "./types";

/**
 * Pharaoh-tier scoring: a win is +10 - depth (prefer faster wins),
 * a loss is -10 + depth (prefer slower losses), draw is 0.
 * This is what makes the AI choose the *most decisive* path, not just any win.
 */
const WIN_BASE = 10;

const now = (): number =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

interface SearchOpts {
  depthLimit: number;
  useAlphaBeta: boolean;
}

const DIFFICULTY_OPTS: Record<Difficulty, SearchOpts> = {
  apprentice: { depthLimit: 0, useAlphaBeta: false },
  scribe: { depthLimit: 2, useAlphaBeta: true },
  pharaoh: { depthLimit: Infinity, useAlphaBeta: true },
};

export function chooseMove(
  board: Board,
  player: Player,
  difficulty: Difficulty,
): MinimaxResult {
  const start = now();
  const opts = DIFFICULTY_OPTS[difficulty];

  if (difficulty === "apprentice") {
    const moves = validMoves(board);
    const bestMove = moves[Math.floor(Math.random() * moves.length)];
    const tree: MinimaxNode = {
      move: null,
      player,
      score: 0,
      depth: 0,
      children: moves.map((m) => ({
        move: m,
        player: otherPlayer(player),
        score: 0,
        depth: 1,
        children: [],
        isChosen: m === bestMove,
      })),
    };
    return {
      bestMove,
      score: 0,
      tree,
      candidateScores: Object.fromEntries(moves.map((m) => [m, 0])),
      nodesEvaluated: moves.length,
      elapsedMs: now() - start,
    };
  }

  const stats = { nodes: 0 };
  const tree = search(board, player, player, 0, -Infinity, Infinity, opts, stats);

  // Collect top-level candidate scores; pick the best (with tie-breaker).
  const candidateScores: Record<number, number> = {};
  let bestMove = -1;
  let bestScore = -Infinity;
  for (const child of tree.children) {
    if (child.move === null) continue;
    candidateScores[child.move] = child.score;
    if (child.score > bestScore) {
      bestScore = child.score;
      bestMove = child.move;
    }
  }
  // Mark the chosen child for viz.
  for (const child of tree.children) {
    child.isChosen = child.move === bestMove;
  }
  tree.score = bestScore;

  return {
    bestMove,
    score: bestScore,
    tree,
    candidateScores,
    nodesEvaluated: stats.nodes,
    elapsedMs: now() - start,
  };
}

function search(
  board: Board,
  toMove: Player,
  maximizing: Player,
  depth: number,
  alpha: number,
  beta: number,
  opts: SearchOpts,
  stats: { nodes: number },
): MinimaxNode {
  stats.nodes++;
  const result = evaluate(board);

  // Terminal: actual end of game.
  if (result.status !== "playing") {
    let score = 0;
    if (result.winner === maximizing) score = WIN_BASE - depth;
    else if (result.winner !== null) score = -WIN_BASE + depth;
    return {
      move: null,
      player: toMove,
      score,
      depth,
      children: [],
      isTerminal: true,
    };
  }

  // Depth cutoff (Scribe): treat as draw / heuristic 0.
  if (depth >= opts.depthLimit) {
    return {
      move: null,
      player: toMove,
      score: 0,
      depth,
      children: [],
      isTerminal: true,
    };
  }

  const isMax = toMove === maximizing;
  const children: MinimaxNode[] = [];
  let bestScore = isMax ? -Infinity : Infinity;
  const moves = validMoves(board);

  for (const move of moves) {
    const nextBoard = applyMove(board, move, toMove);
    const child = search(
      nextBoard,
      otherPlayer(toMove),
      maximizing,
      depth + 1,
      alpha,
      beta,
      opts,
      stats,
    );
    child.move = move;
    children.push(child);

    if (isMax) {
      if (child.score > bestScore) bestScore = child.score;
      alpha = Math.max(alpha, child.score);
    } else {
      if (child.score < bestScore) bestScore = child.score;
      beta = Math.min(beta, child.score);
    }

    if (opts.useAlphaBeta && beta <= alpha) {
      // Mark the remaining as pruned for visualization.
      for (let i = moves.indexOf(move) + 1; i < moves.length; i++) {
        children.push({
          move: moves[i],
          player: otherPlayer(toMove),
          score: NaN,
          depth: depth + 1,
          children: [],
          isPruned: true,
        });
      }
      break;
    }
  }

  return {
    move: null,
    player: toMove,
    score: bestScore,
    depth,
    children,
  };
}
