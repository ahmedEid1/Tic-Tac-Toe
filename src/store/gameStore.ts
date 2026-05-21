import { create } from "zustand";
import { EMPTY_BOARD, applyMove, evaluate, otherPlayer } from "@/lib/game";
import { chooseMove } from "@/lib/minimax";
import { sound } from "@/lib/sound";
import type {
  Board,
  Difficulty,
  GameResult,
  MinimaxResult,
  Mode,
  Player,
} from "@/lib/types";

export interface ScoreTally {
  ankh: number;
  eye: number;
  draws: number;
}

interface PlayerConfig {
  isAi: boolean;
  difficulty: Difficulty;
}

interface GameState {
  board: Board;
  turn: Player;
  mode: Mode;
  ankh: PlayerConfig;
  eye: PlayerConfig;
  result: GameResult;
  history: number[];
  score: ScoreTally;

  // AI visualization state
  aiThinking: boolean;
  lastAiTrace: MinimaxResult | null;

  // AI vs AI controls
  autoPlay: boolean;
  speedMs: number; // delay between AI moves
  pendingAiTimer: ReturnType<typeof setTimeout> | null;
  /**
   * Incremented whenever the game-loop's "intent" changes (mode change,
   * rematch, reset, autoplay toggle). A queued AI turn captures this and bails
   * if the value changed while it slept — preventing stale timers from
   * dropping moves onto a fresh board.
   */
  aiGen: number;

  // Actions
  setMode: (mode: Mode) => void;
  setDifficulty: (player: Player, difficulty: Difficulty) => void;
  playerMove: (index: number) => void;
  rematch: () => void;
  reset: () => void;
  setAutoPlay: (value: boolean) => void;
  setSpeedMs: (ms: number) => void;
  stepAi: () => void;
}

/** Minimum perceptible AI pause in Human-vs-AI so the move doesn't feel instant. */
const HVA_MIN_DELAY_MS = 350;

function configFor(mode: Mode, player: Player): PlayerConfig {
  switch (mode) {
    case "hvh":
      return { isAi: false, difficulty: "pharaoh" };
    case "ava":
      return { isAi: true, difficulty: "pharaoh" };
    case "hva":
      // Ankh = human, Eye = AI
      return player === "ankh"
        ? { isAi: false, difficulty: "pharaoh" }
        : { isAi: true, difficulty: "pharaoh" };
  }
}

function freshGameState(mode: Mode, keepDifficulties?: {
  ankh?: Difficulty;
  eye?: Difficulty;
}): Pick<
  GameState,
  "board" | "turn" | "result" | "history" | "aiThinking" | "lastAiTrace" | "ankh" | "eye"
> {
  const ankh = configFor(mode, "ankh");
  const eye = configFor(mode, "eye");
  if (keepDifficulties?.ankh && ankh.isAi) ankh.difficulty = keepDifficulties.ankh;
  if (keepDifficulties?.eye && eye.isAi) eye.difficulty = keepDifficulties.eye;
  return {
    board: EMPTY_BOARD,
    turn: "ankh",
    result: { status: "playing", winner: null, line: null },
    history: [],
    aiThinking: false,
    lastAiTrace: null,
    ankh,
    eye,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...freshGameState("hva"),
  mode: "hva",
  score: { ankh: 0, eye: 0, draws: 0 },
  autoPlay: true,
  speedMs: 700,
  pendingAiTimer: null,
  aiGen: 0,

  setMode: (mode) => {
    cancelPendingAi(get);
    const keep = { ankh: get().ankh.difficulty, eye: get().eye.difficulty };
    set({ ...freshGameState(mode, keep), mode });
    queueAiTurnIfNeeded(get, set);
  },

  setDifficulty: (player, difficulty) => {
    set((s) => ({ [player]: { ...s[player], difficulty } } as Partial<GameState>));
  },

  playerMove: (index) => {
    const s = get();
    if (s.result.status !== "playing") return;
    if (s.board[index] !== null) return;
    if (s.aiThinking) return;
    if (s[s.turn].isAi) return; // ignore clicks during AI turn

    commitMove(index, get, set, /*isAiMove*/ false);
  },

  rematch: () => {
    cancelPendingAi(get);
    const keep = { ankh: get().ankh.difficulty, eye: get().eye.difficulty };
    set(freshGameState(get().mode, keep));
    queueAiTurnIfNeeded(get, set);
  },

  reset: () => {
    cancelPendingAi(get);
    const keep = { ankh: get().ankh.difficulty, eye: get().eye.difficulty };
    set({
      ...freshGameState(get().mode, keep),
      score: { ankh: 0, eye: 0, draws: 0 },
    });
    queueAiTurnIfNeeded(get, set);
  },

  setAutoPlay: (value) => {
    set({ autoPlay: value });
    if (value) queueAiTurnIfNeeded(get, set);
    else cancelPendingAi(get);
  },

  setSpeedMs: (ms) => set({ speedMs: ms }),

  stepAi: () => {
    const s = get();
    if (s.result.status !== "playing") return;
    if (s.aiThinking) return;
    if (!s[s.turn].isAi) return;
    runAiTurn(get, set);
  },
}));

function cancelPendingAi(get: () => GameState) {
  const s = get();
  if (s.pendingAiTimer !== null) clearTimeout(s.pendingAiTimer);
  // Always bump generation, even if no timer was queued — covers the case
  // where a timer just fired and runAiTurn is mid-flight on the microtask
  // queue: it'll see the bumped gen and abort.
  useGameStore.setState({
    pendingAiTimer: null,
    aiThinking: false,
    aiGen: s.aiGen + 1,
  });
}

function commitMove(
  index: number,
  get: () => GameState,
  set: (partial: Partial<GameState>) => void,
  isAiMove: boolean,
) {
  const s = get();
  const player = s.turn;
  const nextBoard = applyMove(s.board, index, player);
  const result = evaluate(nextBoard);

  sound.play("place");

  const next: Partial<GameState> = {
    board: nextBoard,
    history: [...s.history, index],
    turn: otherPlayer(player),
    result,
    aiThinking: false,
    // Keep lastAiTrace until the next AI run replaces it — lets the user
    // re-read the panel after the AI moved. Only clear on human move.
    lastAiTrace: isAiMove ? s.lastAiTrace : null,
  };

  if (result.status === "won" && result.winner) {
    next.score = {
      ...s.score,
      [result.winner]: s.score[result.winner] + 1,
    };
    sound.play("win");
  } else if (result.status === "draw") {
    next.score = { ...s.score, draws: s.score.draws + 1 };
    sound.play("draw");
  }

  set(next);

  if (result.status === "playing") queueAiTurnIfNeeded(get, set);
}

function queueAiTurnIfNeeded(
  get: () => GameState,
  set: (partial: Partial<GameState>) => void,
) {
  const s = get();
  if (s.result.status !== "playing") return;
  if (!s[s.turn].isAi) return;
  // AI vs AI respects autoPlay; HvA always auto-runs the AI's turn.
  const isAva = s.mode === "ava";
  if (isAva && !s.autoPlay) return;

  const delay = isAva ? s.speedMs : Math.max(HVA_MIN_DELAY_MS, s.speedMs);
  const gen = s.aiGen;
  const timer = setTimeout(() => {
    // If the user changed mode/rematched/reset while we slept, abort.
    if (get().aiGen !== gen) return;
    runAiTurn(get, set);
  }, delay);
  set({ pendingAiTimer: timer, aiThinking: true });
}

function runAiTurn(
  get: () => GameState,
  set: (partial: Partial<GameState>) => void,
) {
  const s = get();
  // Defense in depth: callers (timer + stepAi) should already guard, but the
  // status check here protects against any future caller forgetting.
  if (s.result.status !== "playing") return;
  if (!s[s.turn].isAi) return;

  sound.play("thinking");
  const trace = chooseMove(s.board, s.turn, s[s.turn].difficulty);
  set({ lastAiTrace: trace, pendingAiTimer: null });
  commitMove(trace.bestMove, get, set, /*isAiMove*/ true);
}
