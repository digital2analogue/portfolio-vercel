// Rasterize the hand-authored case-study diagrams to 2× PNG.
//
// Each public/projects/images/ds-*.svg is the editable source; caseContent.ts
// references the .png. This renders every ds-*.svg to a same-basename PNG at
// 2× (retina) via headless chromium, with the site's three Google fonts loaded
// so Space Grotesk / JetBrains Mono text rasterizes correctly. Mirrors the
// approach in scripts/generate-og.mjs.
//
// Run: node scripts/render-diagrams.mjs   (or: npm run render-diagrams)
// Requires: npx playwright install chromium (one-time)

import { chromium } from "playwright";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = resolve(__dirname, "..", "public", "projects", "images");
const SCALE = 2; // PNGs are committed at 2× the SVG viewBox (retina)

const FONTS =
  "https://fonts.googleapis.com/css2?" +
  "family=JetBrains+Mono:wght@400;500;600;700&" +
  "family=Space+Grotesk:wght@300;400;500;600;700&" +
  "family=Spectral:ital,wght@0,400;1,400&display=swap";

/** Read intrinsic width/height off the <svg> root. */
function svgSize(svg) {
  const w = svg.match(/<svg[^>]*\bwidth="([\d.]+)"/);
  const h = svg.match(/<svg[^>]*\bheight="([\d.]+)"/);
  if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) };
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
  throw new Error("could not determine SVG size");
}

const files = readdirSync(IMG_DIR)
  .filter((f) => f.startsWith("ds-") && f.endsWith(".svg"))
  .sort();

if (!files.length) {
  console.error("no ds-*.svg found in", IMG_DIR);
  process.exit(1);
}

// Prefer the environment's pre-installed Chromium (its build may not match the
// npm playwright package's bundled version); fall back to the bundled browser.
const EXEC = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium";
const browser = await chromium.launch(
  existsSync(EXEC) ? { executablePath: EXEC } : {},
);
for (const file of files) {
  const svg = readFileSync(join(IMG_DIR, file), "utf8");
  const { width, height } = svgSize(svg);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<style>html,body{margin:0;padding:0;background:#0A0D0A}svg{display:block}</style>
</head><body>${svg}</body></html>`;

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const out = join(IMG_DIR, file.replace(/\.svg$/, ".png"));
  await page.screenshot({
    path: out,
    type: "png",
    clip: { x: 0, y: 0, width, height },
    omitBackground: false,
  });
  await context.close();
  console.log(`[diagram] ${file} → ${file.replace(/\.svg$/, ".png")}  (${width * SCALE}×${height * SCALE})`);
}
await browser.close();
