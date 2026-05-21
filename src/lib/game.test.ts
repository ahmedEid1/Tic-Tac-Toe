import { describe, expect, it } from "vitest";
import {
  EMPTY_BOARD,
  WIN_LINES,
  applyMove,
  evaluate,
  otherPlayer,
  validMoves,
} from "./game";
import type { Board } from "./types";

describe("game.evaluate", () => {
  it("returns 'playing' on an empty board", () => {
    const r = evaluate(EMPTY_BOARD);
    expect(r.status).toBe("playing");
    expect(r.winner).toBeNull();
    expect(r.line).toBeNull();
  });

  it("detects every winning line", () => {
    for (const line of WIN_LINES) {
      const b: Board = Array(9).fill(null);
      const mb = b.slice();
      for (const i of line) mb[i] = "ankh";
      const r = evaluate(mb);
      expect(r.status).toBe("won");
      expect(r.winner).toBe("ankh");
      expect(r.line).toEqual(line);
    }
  });

  it("detects draws", () => {
    // Filled, no winner.
    const b: Board = [
      "ankh", "eye",  "ankh",
      "ankh", "eye",  "eye",
      "eye",  "ankh", "ankh",
    ];
    expect(evaluate(b).status).toBe("draw");
  });

  it("returns the first matching line, not e.g. multiple wins", () => {
    // A board that satisfies row 0 and column 0 simultaneously for ankh.
    const b: Board = [
      "ankh", "ankh", "ankh",
      "ankh", null,   null,
      "ankh", null,   null,
    ];
    const r = evaluate(b);
    expect(r.status).toBe("won");
    expect(r.winner).toBe("ankh");
  });
});

describe("game.validMoves / applyMove / otherPlayer", () => {
  it("validMoves on empty board lists all 9", () => {
    expect(validMoves(EMPTY_BOARD)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("validMoves excludes filled cells", () => {
    const b: Board = ["ankh", null, "eye", null, "ankh", null, null, null, null];
    expect(validMoves(b)).toEqual([1, 3, 5, 6, 7, 8]);
  });

  it("applyMove returns a new board (does not mutate)", () => {
    const before = EMPTY_BOARD;
    const after = applyMove(before, 4, "ankh");
    expect(before[4]).toBeNull();
    expect(after[4]).toBe("ankh");
    expect(after).not.toBe(before);
  });

  it("otherPlayer alternates", () => {
    expect(otherPlayer("ankh")).toBe("eye");
    expect(otherPlayer("eye")).toBe("ankh");
  });
});
