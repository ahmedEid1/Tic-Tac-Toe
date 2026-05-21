import type { Board, GameResult, Player, WinLine } from "./types";

export const WIN_LINES: readonly WinLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const EMPTY_BOARD: Board = Object.freeze(Array<null>(9).fill(null));

export function otherPlayer(p: Player): Player {
  return p === "ankh" ? "eye" : "ankh";
}

export function evaluate(board: Board): GameResult {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && board[b] === v && board[c] === v) {
      return { status: "won", winner: v, line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { status: "draw", winner: null, line: null };
  }
  return { status: "playing", winner: null, line: null };
}

export function validMoves(board: Board): number[] {
  const out: number[] = [];
  for (let i = 0; i < 9; i++) if (board[i] === null) out.push(i);
  return out;
}

export function applyMove(board: Board, index: number, player: Player): Board {
  const next = board.slice();
  next[index] = player;
  return next;
}
