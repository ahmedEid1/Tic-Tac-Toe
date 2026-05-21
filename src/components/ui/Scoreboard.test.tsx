import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Scoreboard from "./Scoreboard";
import { useGameStore } from "@/store/gameStore";
import { useLocaleStore } from "@/lib/i18n";

beforeEach(() => {
  useLocaleStore.getState().setLocale("en");
  useGameStore.getState().setMode("hvh");
  useGameStore.getState().reset();
});

describe("Scoreboard", () => {
  it("starts at 0 / 0 / 0", () => {
    render(<Scoreboard />);
    // All three counters show 0
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(3);
  });

  it("renders the three localized labels", () => {
    render(<Scoreboard />);
    // Each label is a span; the same string also appears as an SVG aria-label.
    // Use getAllByText to allow both, but expect at least one of each.
    expect(screen.getAllByText("Ankh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Eye of Horus").length).toBeGreaterThan(0);
    expect(screen.getByText("Draws")).toBeInTheDocument();
  });

  it("flips to Arabic labels when the locale changes", () => {
    useLocaleStore.getState().setLocale("ar");
    render(<Scoreboard />);
    expect(screen.getAllByText("العنخ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("عين حورس").length).toBeGreaterThan(0);
    expect(screen.getByText("تعادل")).toBeInTheDocument();
  });
});
