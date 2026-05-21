import { describe, expect, it } from "vitest";
import { chooseMove } from "./minimax";
import { applyMove, evaluate, otherPlayer } from "./game";
import { EMPTY_BOARD } from "./game";
import type { Board, Player } from "./types";

/**
 * Drive a full game between two move-pickers. Returns the result and the
 * sequence of moves played.
 */
function playGame(
  ankh: (board: Board, player: Player) => number,
  eye: (board: Board, player: Player) => number,
): { winner: Player | null; moves: number[] } {
  let board: Board = EMPTY_BOARD;
  let toMove: Player = "ankh";
  const moves: number[] = [];
  for (let ply = 0; ply < 9; ply++) {
    const pick = toMove === "ankh" ? ankh : eye;
    const move = pick(board, toMove);
    moves.push(move);
    board = applyMove(board, move, toMove);
    const r = evaluate(board);
    if (r.status !== "playing") return { winner: r.winner, moves };
    toMove = otherPlayer(toMove);
  }
  return { winner: null, moves };
}

const pharaoh = (b: Board, p: Player) => chooseMove(b, p, "pharaoh").bestMove;
const apprentice = (b: Board, p: Player) =>
  chooseMove(b, p, "apprentice").bestMove;

describe("chooseMove — Pharaoh", () => {
  it("returns a valid move on an empty board", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "pharaoh");
    expect(r.bestMove).toBeGreaterThanOrEqual(0);
    expect(r.bestMove).toBeLessThan(9);
  });

  it("scores the opening move as 0 (draw with perfect play)", () => {
    // Tic-tac-toe is a forced draw with perfect play from both sides; the
    // root score must be exactly 0.
    const r = chooseMove(EMPTY_BOARD, "ankh", "pharaoh");
    expect(r.score).toBe(0);
  });

  it("takes an immediate win when one is available", () => {
    // Ankh has two in a row; the third cell should win.
    const b: Board = [
      "ankh", "ankh", null,
      "eye",  "eye",  null,
      null,   null,   null,
    ];
    const r = chooseMove(b, "ankh", "pharaoh");
    expect(r.bestMove).toBe(2); // completing the top row
    expect(r.score).toBeGreaterThan(0);
  });

  it("blocks an opponent's immediate winning threat", () => {
    // Eye is about to win the diagonal 0-4-8; Ankh must block at 8.
    const b: Board = [
      "eye",  "ankh", null,
      null,   "eye",  null,
      null,   null,   null,
    ];
    const r = chooseMove(b, "ankh", "pharaoh");
    expect(r.bestMove).toBe(8);
  });

  it("prefers a faster win when given a choice (depth-penalty)", () => {
    // Ankh can win in one move (cell 2) OR in three moves via another path.
    // The depth penalty must steer it to cell 2.
    const b: Board = [
      "ankh", "ankh", null,
      "eye",  null,   null,
      null,   "eye",  null,
    ];
    const r = chooseMove(b, "ankh", "pharaoh");
    expect(r.bestMove).toBe(2);
    // Score should be 9 = 10 − 1 (one ply to terminal).
    expect(r.score).toBe(9);
  });

  it("two Pharaohs always draw", () => {
    // Run a handful of head-to-head games; result must always be null (draw).
    for (let i = 0; i < 5; i++) {
      const { winner } = playGame(pharaoh, pharaoh);
      expect(winner).toBeNull();
    }
  });

  it("never loses to a random opponent", () => {
    // With Apprentice as both colours' opponent (random) and Pharaoh always
    // first, Pharaoh should win or draw — never lose. Sample many games
    // because Apprentice is non-deterministic.
    let losses = 0;
    for (let i = 0; i < 30; i++) {
      const { winner } = playGame(pharaoh, apprentice);
      if (winner === "eye") losses++;
    }
    expect(losses).toBe(0);
  });

  it("records candidateScores for every legal first move", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "pharaoh");
    // 9 candidates on an empty board.
    expect(Object.keys(r.candidateScores).length).toBe(9);
    // Best move's score in candidateScores matches the result.
    expect(r.candidateScores[r.bestMove]).toBe(r.score);
  });

  it("marks exactly one child as chosen in the tree", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "pharaoh");
    const chosen = r.tree.children.filter((c) => c.isChosen);
    expect(chosen.length).toBe(1);
    expect(chosen[0].move).toBe(r.bestMove);
  });

  it("alpha-beta prunes branches in non-trivial positions", () => {
    // A position mid-game where pruning should kick in.
    const b: Board = [
      "ankh", null, "eye",
      null,   "ankh", null,
      "eye",  null, null,
    ];
    const r = chooseMove(b, "ankh", "pharaoh");
    const allNodes: number[] = [];
    const walk = (n: typeof r.tree) => {
      allNodes.push(n.isPruned ? 1 : 0);
      n.children.forEach(walk);
    };
    walk(r.tree);
    const prunedCount = allNodes.filter((x) => x === 1).length;
    expect(prunedCount).toBeGreaterThan(0);
  });
});

describe("chooseMove — Scribe (depth-limited)", () => {
  it("returns a valid move", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "scribe");
    expect(r.bestMove).toBeGreaterThanOrEqual(0);
    expect(r.bestMove).toBeLessThan(9);
  });

  it("still takes an immediate win at depth 1", () => {
    const b: Board = [
      "ankh", "ankh", null,
      "eye",  "eye",  null,
      null,   null,   null,
    ];
    const r = chooseMove(b, "ankh", "scribe");
    expect(r.bestMove).toBe(2);
  });

  it("explores fewer nodes than Pharaoh", () => {
    const scribe = chooseMove(EMPTY_BOARD, "ankh", "scribe");
    const pharaoh = chooseMove(EMPTY_BOARD, "ankh", "pharaoh");
    expect(scribe.nodesEvaluated).toBeLessThan(pharaoh.nodesEvaluated);
  });
});

describe("chooseMove — Apprentice (random)", () => {
  it("picks a legal move", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "apprentice");
    expect(r.bestMove).toBeGreaterThanOrEqual(0);
    expect(r.bestMove).toBeLessThan(9);
  });

  it("does not search (nodesEvaluated equals number of legal moves)", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "apprentice");
    expect(r.nodesEvaluated).toBe(9);
  });

  it("eventually picks every legal cell over many runs (non-deterministic)", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 200; i++) {
      seen.add(chooseMove(EMPTY_BOARD, "ankh", "apprentice").bestMove);
    }
    expect(seen.size).toBe(9);
  });
});

describe("chooseMove — perf budget", () => {
  it("Pharaoh evaluates the empty board in under 100ms", () => {
    const r = chooseMove(EMPTY_BOARD, "ankh", "pharaoh");
    expect(r.elapsedMs).toBeLessThan(100);
  });
});

// Suppress unused-import lint warnings in the test file.
void [otherPlayer];
