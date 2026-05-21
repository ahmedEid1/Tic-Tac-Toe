import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Board2D from "./Board2D";
import { useGameStore } from "@/store/gameStore";

beforeEach(() => {
  // Reset to a fresh game in Human-vs-Human so clicks land deterministically
  // (no AI auto-response to worry about).
  useGameStore.getState().setMode("hvh");
  useGameStore.getState().reset();
});

describe("Board2D", () => {
  it("renders 9 clickable cells with cardinal aria-labels", () => {
    render(<Board2D />);
    const labels = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];
    for (const l of labels) {
      expect(screen.getByRole("button", { name: `Cell ${l}` })).toBeInTheDocument();
    }
  });

  it("placing a click updates the store with the played move", () => {
    render(<Board2D />);
    fireEvent.click(screen.getByRole("button", { name: "Cell C" }));
    expect(useGameStore.getState().board[4]).toBe("ankh");
    expect(useGameStore.getState().history).toEqual([4]);
    expect(useGameStore.getState().turn).toBe("eye");
  });

  it("clicking the same cell twice is a no-op", () => {
    render(<Board2D />);
    const cell = screen.getByRole("button", { name: "Cell C" });
    fireEvent.click(cell);
    fireEvent.click(cell);
    expect(useGameStore.getState().board[4]).toBe("ankh");
    // After a single move, it's Eye's turn — clicking again wouldn't even
    // try to place Ankh; nothing should have changed beyond the first ply.
    expect(useGameStore.getState().history).toEqual([4]);
  });
});
