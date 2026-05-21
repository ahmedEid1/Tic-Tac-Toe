/**
 * Records a short looping GIF of a Pharaoh's Gambit gameplay sequence for
 * the README hero. Drives the local dev server via puppeteer, takes frames
 * at scripted moments, then encodes them as a GIF with gifenc.
 *
 * Run with the dev server up:
 *   PORT=3001 node scripts/gif.mjs
 */
import puppeteer from "puppeteer";
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;
import { PNG } from "pngjs";
import { mkdir, writeFile } from "node:fs/promises";

const PORT = process.env.PORT ?? 3001;
const BASE = `http://localhost:${PORT}`;
const OUT = "public/screenshots";
const OUT_FILE = `${OUT}/gameplay.gif`;
const WIDTH = 1280;
const HEIGHT = 820;

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
console.log("→ loading page…");
await page.goto(BASE, { waitUntil: "networkidle0" });

// Wait until React has hydrated and the board exists.
let ready = false;
for (let i = 0; i < 30 && !ready; i++) {
  ready = await page.evaluate(
    () => !!document.querySelector('button[data-cell="4"]'),
  );
  if (!ready) await new Promise((r) => setTimeout(r, 500));
}
if (!ready) {
  console.error("board never rendered");
  await browser.close();
  process.exit(1);
}

async function frame() {
  const buf = await page.screenshot({ type: "png", encoding: "binary" });
  return PNG.sync.read(Buffer.from(buf));
}

async function wait(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function click(cell) {
  await page.evaluate((c) => {
    document.querySelector(`button[data-cell="${c}"]`)?.click();
  }, cell);
}

// Storyboard: build a satisfying mini-game.
// Human plays center, AI responds, human plays a corner, AI responds, …
const FRAMES = [];

// Frame 0: pristine board, brief pause for the eye.
FRAMES.push({ delay: 900, png: await frame() });

// Move 1 — Human plays center (Ankh).
await click(4);
await wait(450);
FRAMES.push({ delay: 600, png: await frame() });

// Wait for AI's first move + thinking panel.
await wait(1500);
FRAMES.push({ delay: 900, png: await frame() });

// Move 2 — Human plays a corner (NW).
await click(0);
await wait(450);
FRAMES.push({ delay: 600, png: await frame() });

// AI's second move.
await wait(1700);
FRAMES.push({ delay: 900, png: await frame() });

// Move 3 — Human plays the opposite corner (SE), classic fork setup.
await click(8);
await wait(450);
FRAMES.push({ delay: 600, png: await frame() });

// AI defends.
await wait(1700);
FRAMES.push({ delay: 1300, png: await frame() }); // pause longer on the last frame before looping

await browser.close();
console.log(`→ ${FRAMES.length} frames captured. Encoding…`);

// Encode as GIF.
const gif = GIFEncoder();
for (const { png, delay } of FRAMES) {
  // gifenc wants a Uint8ClampedArray of RGBA.
  const rgba = new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength);
  const palette = quantize(rgba, 256, { format: "rgba4444" });
  const indexed = applyPalette(rgba, palette, "rgba4444");
  gif.writeFrame(indexed, png.width, png.height, { palette, delay });
}
gif.finish();

await writeFile(OUT_FILE, gif.bytes());
console.log(`✓ ${OUT_FILE} (${(gif.bytes().length / 1024).toFixed(1)} KB)`);
