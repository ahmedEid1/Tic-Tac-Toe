/**
 * Capture screenshots of the running dev server for README + OG image.
 * Run with the dev server already up: `npm run dev` (port 3001), then
 * `node scripts/screenshots.mjs`.
 */
import captureWebsite from "capture-website";
import { mkdir } from "node:fs/promises";

const PORT = process.env.PORT ?? 3001;
const BASE = `http://localhost:${PORT}`;
const OUT = "public/screenshots";

await mkdir(OUT, { recursive: true });

const SHOTS = [
  {
    name: "hero",
    desc: "Empty board, English",
    width: 1440,
    height: 900,
    delay: 2,
  },
  {
    name: "thinking",
    desc: "Mid-game with AI thinking panel populated",
    width: 1440,
    height: 900,
    delay: 1,
    beforeScreenshot: async (page) => {
      // Poll for the cells — dev mode hydration timing is unreliable.
      let found = false;
      for (let i = 0; i < 40 && !found; i++) {
        found = await page.evaluate(
          () => !!document.querySelector('button[data-cell="4"]'),
        );
        if (!found) await new Promise((r) => setTimeout(r, 500));
      }
      if (!found) throw new Error("board cells never appeared");
      await page.evaluate(() => {
        document.querySelector('button[data-cell="4"]')?.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
    },
  },
  {
    name: "winning",
    desc: "A game-over state",
    width: 1440,
    height: 900,
    delay: 1,
    beforeScreenshot: async (page) => {
      await new Promise((r) => setTimeout(r, 2500));
      // Switch to Trial of the Gods (3rd mode button).
      await page.evaluate(() => {
        const trialBtn = Array.from(
          document.querySelectorAll("button"),
        ).find((b) => /trial of the gods|نزال/i.test(b.textContent ?? ""));
        trialBtn?.click();
      });
      await new Promise((r) => setTimeout(r, 400));
      // Set Ankh AI = Apprentice for a decisive game.
      await page.evaluate(() => {
        const apprenticeBtns = Array.from(
          document.querySelectorAll("button"),
        ).filter((b) => /apprentice|متدرّب/i.test(b.textContent ?? ""));
        apprenticeBtns[0]?.click();
      });
      // Crank speed slider to max-fast for quick capture.
      await page.evaluate(() => {
        const slider = document.querySelector('input[type="range"]');
        if (slider) {
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;
          setter?.call(slider, "2400");
          slider.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      // Let AI v AI play out (capped at ~3.5s for 9 plies × ~120ms).
      await new Promise((r) => setTimeout(r, 5000));
    },
  },
  {
    name: "arabic",
    desc: "Arabic RTL with mid-game state",
    width: 1440,
    height: 900,
    delay: 1,
    beforeScreenshot: async (page) => {
      await new Promise((r) => setTimeout(r, 2500));
      // Toggle to Arabic.
      await page.evaluate(() => {
        const langBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => /^Switch to/i.test(b.getAttribute("aria-label") ?? ""),
        );
        langBtn?.click();
      });
      await new Promise((r) => setTimeout(r, 500));
      // Make a move so the thinking panel populates.
      await page.evaluate(() => {
        document.querySelector('button[data-cell="4"]')?.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
    },
  },
  {
    name: "og",
    desc: "Open Graph 1200x630 with a populated thinking panel",
    width: 1200,
    height: 630,
    delay: 1,
    beforeScreenshot: async (page) => {
      // Wait for cells, click the center, let AI respond.
      let found = false;
      for (let i = 0; i < 40 && !found; i++) {
        found = await page.evaluate(
          () => !!document.querySelector('button[data-cell="4"]'),
        );
        if (!found) await new Promise((r) => setTimeout(r, 500));
      }
      if (!found) throw new Error("board cells never appeared");
      await page.evaluate(() => {
        document.querySelector('button[data-cell="4"]')?.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
    },
  },
  {
    name: "mobile",
    desc: "Mobile viewport (iPhone-ish) full page",
    width: 390,
    height: 1280,
    delay: 1,
    fullPage: true,
    beforeScreenshot: async (page) => {
      // Set a mobile-ish viewport explicitly so layouts react.
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
      // Let the board cells render, click center, wait for AI.
      let found = false;
      for (let i = 0; i < 40 && !found; i++) {
        found = await page.evaluate(
          () => !!document.querySelector('button[data-cell="4"]'),
        );
        if (!found) await new Promise((r) => setTimeout(r, 500));
      }
      if (!found) return;
      await page.evaluate(() => {
        document.querySelector('button[data-cell="4"]')?.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
    },
  },
];

for (const shot of SHOTS) {
  const file = `${OUT}/${shot.name}.png`;
  console.log(`→ ${shot.name}: ${shot.desc}`);
  try {
    await captureWebsite.file(BASE, file, {
      width: shot.width,
      height: shot.height,
      delay: shot.delay,
      beforeScreenshot: shot.beforeScreenshot,
      overwrite: true,
      type: "png",
      fullPage: shot.fullPage ?? false,
    });
    console.log(`  ✓ ${file}`);
  } catch (err) {
    console.error(`  ✗ ${shot.name} failed:`, err.message);
  }
}

console.log("Done.");
process.exit(0);
