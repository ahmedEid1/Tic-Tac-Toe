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

// Storyboard: switch to Trial-of-the-Gods (Apprentice vs Pharaoh) and let
// the unbeatable AI defeat the random one — gives a satisfying complete arc
// from empty board → multiple plies → glowing winning row + verdict banner,
// all in ~10 seconds of looping playback.
const FRAMES = [];

console.log("→ switching to Trial of the Gods + Apprentice Ankh");

// Pause AI v AI auto-play first so we can configure cleanly.
await page.evaluate(() => {
  // Switch to Trial of the Gods (AvA).
  const ava = Array.from(document.querySelectorAll("button")).find((b) =>
    /trial of the gods/i.test(b.textContent ?? ""),
  );
  ava?.click();
});
await wait(400);

// Pause the autoplay so the board sits empty long enough for the first
// frame, then resume after the first capture.
await page.evaluate(() => {
  const pause = Array.from(document.querySelectorAll("button")).find((b) =>
    /^pause$/i.test((b.textContent ?? "").trim()),
  );
  pause?.click();
});
await wait(300);

// Set Ankh AI to Apprentice so the game is decisive.
await page.evaluate(() => {
  const ap = Array.from(document.querySelectorAll("button")).filter((b) =>
    /^apprentice$/i.test((b.textContent ?? "").trim()),
  );
  ap[0]?.click(); // first Apprentice button = Ankh AI
});
await wait(300);

// Speed slider: slow enough that the AI's thinking panel is legible
// in each frame, but fast enough that the whole game finishes in
// ~10 seconds of capture.
await page.evaluate(() => {
  const slider = document.querySelector('input[type="range"]');
  if (slider) {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(slider, "1600"); // ~920 ms between AI moves
    slider.dispatchEvent(new Event("input", { bubbles: true }));
  }
});
await wait(300);

// Frame 0: configured but board still empty.
FRAMES.push({ delay: 900, png: await frame() });

// Resume autoplay and let the game unfold; capture frames at intervals.
await page.evaluate(() => {
  const resume = Array.from(document.querySelectorAll("button")).find((b) =>
    /^resume$/i.test((b.textContent ?? "").trim()),
  );
  resume?.click();
});

// Capture frames every ~900ms (one per AI move ~roughly) while game plays out.
for (let i = 0; i < 12; i++) {
  await wait(900);
  FRAMES.push({ delay: 450, png: await frame() });

  // If the game ended (verdict banner visible), capture an extra long-hold
  // final frame and stop.
  const done = await page.evaluate(() =>
    /glory|sands|المجد|تساوت/i.test(document.body.innerText),
  );
  if (done) {
    await wait(800);
    FRAMES.push({ delay: 2000, png: await frame() }); // long hold on victory
    break;
  }
}

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
