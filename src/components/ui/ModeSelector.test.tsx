import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeSelector from "./ModeSelector";
import { useGameStore } from "@/store/gameStore";
import { useLocaleStore } from "@/lib/i18n";

beforeEach(() => {
  useLocaleStore.getState().setLocale("en");
  useGameStore.getState().setMode("hvh");
  useGameStore.getState().reset();
});

describe("ModeSelector", () => {
  it("offers the three game modes", () => {
    render(<ModeSelector />);
    expect(screen.getByText("Mortal vs Mortal")).toBeInTheDocument();
    expect(screen.getByText("Mortal vs Pharaoh")).toBeInTheDocument();
    expect(screen.getByText("Trial of the Gods")).toBeInTheDocument();
  });

  it("clicking 'Trial of the Gods' switches the store to AvA", () => {
    render(<ModeSelector />);
    fireEvent.click(screen.getByText("Trial of the Gods").closest("button")!);
    expect(useGameStore.getState().mode).toBe("ava");
    expect(useGameStore.getState().ankh.isAi).toBe(true);
    expect(useGameStore.getState().eye.isAi).toBe(true);
  });

  it("the active mode's button has aria-pressed=true", () => {
    useGameStore.getState().setMode("hva");
    render(<ModeSelector />);
    const hvaBtn = screen.getByText("Mortal vs Pharaoh").closest("button")!;
    expect(hvaBtn.getAttribute("aria-pressed")).toBe("true");
  });
});
