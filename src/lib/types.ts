export type Player = "ankh" | "eye";
export type Cell = Player | null;
export type Board = readonly Cell[]; // length 9

export type Mode = "hvh" | "hva" | "ava";
export type Difficulty = "apprentice" | "scribe" | "pharaoh";
export type Status = "playing" | "won" | "draw";

export type WinLine = readonly [number, number, number];

export interface GameResult {
  status: Status;
  winner: Player | null;
  line: WinLine | null;
}

export interface MinimaxNode {
  move: number | null; // cell index that produced this state (null = root)
  player: Player; // whose turn it is at this node
  score: number;
  depth: number;
  children: MinimaxNode[];
  isChosen?: boolean;
  isPruned?: boolean;
  isTerminal?: boolean;
}

export interface MinimaxResult {
  bestMove: number;
  score: number;
  tree: MinimaxNode;
  /** Score per candidate top-level move, for cell overlay display. */
  candidateScores: Record<number, number>;
  nodesEvaluated: number;
  elapsedMs: number;
}
