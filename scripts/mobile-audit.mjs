/**
 * Capture screenshots of the running dev server at three viewport widths
 * so we can audit how the page reflows. Run with the dev server up.
 */
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";

const PORT = process.env.PORT ?? 3001;
const BASE = `http://localhost:${PORT}`;
const OUT = "tmp-audit";

await mkdir(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "phone-375", width: 375, height: 812 },   // iPhone X-ish
  { name: "phone-390", width: 390, height: 844 },   // iPhone 14
  { name: "tablet-768", width: 768, height: 1024 }, // iPad portrait
];

const browser = await puppeteer.launch({ headless: true });

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));

  // Above the fold capture
  await page.screenshot({
    path: `${OUT}/${vp.name}-fold.png`,
    type: "png",
  });
  // Full page capture
  await page.screenshot({
    path: `${OUT}/${vp.name}-full.png`,
    type: "png",
    fullPage: true,
  });

  // Now click center to populate the AI thinking panel + AI move, then capture again.
  let ready = false;
  for (let i = 0; i < 30 && !ready; i++) {
    ready = await page.evaluate(
      () => !!document.querySelector('button[data-cell="4"]'),
    );
    if (!ready) await new Promise((r) => setTimeout(r, 500));
  }
  if (ready) {
    await page.evaluate(() => {
      document.querySelector('button[data-cell="4"]')?.click();
    });
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({
      path: `${OUT}/${vp.name}-thinking.png`,
      type: "png",
      fullPage: true,
    });
  }

  console.log(`✓ ${vp.name} captured`);
  await page.close();
}

await browser.close();
console.log("Done.");
