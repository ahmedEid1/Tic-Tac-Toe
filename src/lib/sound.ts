/**
 * Tiny Web Audio synth — no asset files, no deps.
 * Sounds are generated on the fly so the bundle stays small and SFX feel cohesive.
 */

type SoundName = "place" | "win" | "draw" | "click" | "thinking";

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  durationMs: number,
  opts: {
    type?: OscillatorType;
    gain?: number;
    attack?: number;
    release?: number;
    delay?: number;
    detune?: number;
  } = {},
) {
  const ac = getCtx();
  if (!ac || muted) return;
  const {
    type = "sine",
    gain = 0.12,
    attack = 0.01,
    release = 0.12,
    delay = 0,
    detune = 0,
  } = opts;

  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;

  const start = ac.currentTime + delay;
  const end = start + durationMs / 1000;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + attack);
  g.gain.setValueAtTime(gain, end);
  g.gain.exponentialRampToValueAtTime(0.0001, end + release);

  osc.connect(g).connect(ac.destination);
  osc.start(start);
  osc.stop(end + release + 0.02);
}

function noiseHit(durationMs: number, gain = 0.18) {
  const ac = getCtx();
  if (!ac || muted) return;
  const sampleCount = Math.floor((ac.sampleRate * durationMs) / 1000);
  const buffer = ac.createBuffer(1, sampleCount, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleCount;
    data[i] = (Math.random() * 2 - 1) * (1 - t) ** 2;
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(ac.destination);
  src.start();
}

export const sound = {
  play(name: SoundName) {
    switch (name) {
      case "place":
        // Soft warm thud + low body — feels like setting a stone tile.
        noiseHit(140, 0.14);
        tone(120, 220, { type: "sine", gain: 0.18, release: 0.2 });
        break;
      case "win":
        // Ascending major triad — a small ceremonial fanfare.
        tone(523.25, 220, { type: "triangle", gain: 0.14 }); // C5
        tone(659.25, 220, { type: "triangle", gain: 0.14, delay: 0.12 }); // E5
        tone(783.99, 360, { type: "triangle", gain: 0.16, delay: 0.24 }); // G5
        tone(1046.5, 520, { type: "sine", gain: 0.1, delay: 0.36 }); // C6 shimmer
        break;
      case "draw":
        tone(330, 240, { type: "sine", gain: 0.1 });
        tone(294, 320, { type: "sine", gain: 0.1, delay: 0.18 });
        break;
      case "click":
        tone(880, 50, { type: "square", gain: 0.04, release: 0.05 });
        break;
      case "thinking":
        // A brief lapis shimmer — a soft high tone while the AI evaluates.
        tone(1175, 60, { type: "sine", gain: 0.05, release: 0.08 });
        break;
    }
  },
  toggleMute(value?: boolean): boolean {
    muted = value ?? !muted;
    return muted;
  },
  isMuted(): boolean {
    return muted;
  },
};
