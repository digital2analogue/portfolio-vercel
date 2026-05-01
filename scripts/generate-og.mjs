// Generate the social preview card at /public/og.png (1200×630).
// Mirrors the site's dark, terminal-feel identity: phosphor accent on near-
// black, JetBrains Mono chrome with Space Grotesk for the name.
//
// Run: node scripts/generate-og.mjs
// Requires: npx playwright install chromium (one-time)

import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "public", "og.png");

// Pulled from app/globals.css — keep in sync if tokens change.
const BG = "#0A0D0A";
const FG = "#c8cfc4";
const MUTED = "#8b9683";
const ACCENT = "#4ADE6E";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&family=Space+Grotesk:wght@300;400&family=Spectral:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px;
    background: ${BG};
    color: ${FG};
    font-family: "Space Grotesk", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }
  .card {
    position: relative;
    width: 100%; height: 100%;
    box-sizing: border-box;
    padding: 64px 80px;
    display: flex; flex-direction: column;
    justify-content: space-between;
  }
  /* phosphor frame — single 1px accent stroke, inset */
  .card::before {
    content: "";
    position: absolute;
    inset: 24px;
    border: 1px solid ${ACCENT};
    opacity: 0.55;
    pointer-events: none;
  }
  .mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
  .accent { color: ${ACCENT}; }
  .muted  { color: ${MUTED};  }

  .top {
    display: flex; align-items: center; gap: 14px;
    font-size: 18px; letter-spacing: 0.03em;
    color: ${MUTED};
  }
  .dot {
    width: 10px; height: 10px; border-radius: 9999px;
    background: ${ACCENT};
    box-shadow: 0 0 12px ${ACCENT};
  }

  .term {
    font-size: 22px; line-height: 1.6;
    color: ${MUTED};
  }
  .term .ans { color: ${FG}; }

  .name {
    font-family: "Space Grotesk", system-ui, sans-serif;
    font-weight: 300;
    font-size: 116px;
    letter-spacing: -0.025em;
    line-height: 1;
    color: ${FG};
    margin: 18px 0 22px;
  }
  .name em {
    font-family: "Spectral", Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: ${FG};
  }

  .lede {
    font-family: "Spectral", Georgia, serif;
    font-size: 28px;
    line-height: 1.45;
    color: ${FG};
    max-width: 980px;
  }

  .bottom {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 18px; letter-spacing: 0.03em;
  }
  .tags { display: flex; gap: 22px; color: ${MUTED}; }
  .tags .sep { color: ${ACCENT}; opacity: 0.6; }
  .url { color: ${FG}; }
  .url .caret { color: ${ACCENT}; }
</style>
</head>
<body>
  <div class="card">
    <div>
      <div class="top mono">
        <span class="dot"></span>
        <span><span class="accent">~</span> $ whoami</span>
      </div>
      <div class="term mono" style="margin-top: 18px;">
        <span class="muted">// </span><span class="ans">River Romney — Design Systems Designer</span>
      </div>
      <h1 class="name">River <em>Romney</em></h1>
      <p class="lede">
        Design systems, decision tooling, and enterprise UX.
        Ten years shipping compliance-heavy B2B fintech.
      </p>
    </div>

    <div class="bottom mono">
      <div class="tags">
        <span>design&nbsp;systems</span>
        <span class="sep">·</span>
        <span>decision&nbsp;tooling</span>
        <span class="sep">·</span>
        <span>enterprise&nbsp;UX</span>
      </div>
      <div class="url">
        <span class="caret">▸</span>&nbsp;riverromney.com
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
// Give web fonts a beat to settle even after networkidle.
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: OUT, type: "png", omitBackground: false });
await browser.close();

console.log(`[og] wrote ${OUT}`);
