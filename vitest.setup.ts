import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// React Testing Library leaves the DOM in place between tests; clean it
// so cross-test selectors don't see stale nodes.
afterEach(() => {
  cleanup();
});

// Some browser APIs that jsdom doesn't ship: stub the ones the app touches.
if (typeof window !== "undefined") {
  // localStorage exists in jsdom; nothing to stub there.

  // matchMedia is used by Framer Motion to honour prefers-reduced-motion.
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  // AudioContext is invoked by sound.ts when the user clicks anything. Web
  // Audio's `connect()` returns the destination node so that chains like
  // `a.connect(b).connect(c)` work — the mocks have to honour that.
  if (!("AudioContext" in window)) {
    const param = () => ({
      value: 0,
      setValueAtTime: () => {},
      linearRampToValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
    });
    const node = () => ({
      connect: (target: unknown) => target,
      disconnect: () => {},
    });
    (window as unknown as { AudioContext: unknown }).AudioContext =
      class FakeAudioContext {
        state = "running";
        currentTime = 0;
        sampleRate = 44100;
        destination = node();
        createOscillator() {
          return {
            ...node(),
            type: "sine",
            frequency: param(),
            detune: param(),
            start: () => {},
            stop: () => {},
          };
        }
        createGain() {
          return { ...node(), gain: param() };
        }
        createBiquadFilter() {
          return { ...node(), type: "lowpass", frequency: param() };
        }
        createBufferSource() {
          return { ...node(), buffer: null, start: () => {} };
        }
        createBuffer() {
          return { getChannelData: () => new Float32Array(0) };
        }
        resume() {
          return Promise.resolve();
        }
      };
  }
}
