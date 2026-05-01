// One-off script: capture screenshots of the Decisioning Table prototype.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'projects', 'images');
const BASE_URL = 'https://decisioning-table.vercel.app/';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function findOnboardingScroller(page) {
  const handle = await page.evaluateHandle(() => {
    const els = Array.from(document.querySelectorAll('*'));
    return (
      els.find((el) => {
        const cs = getComputedStyle(el);
        return (
          (cs.overflowY === 'auto' || cs.overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight + 50
        );
      }) || document.scrollingElement
    );
  });
  return handle;
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  console.log('→ Open root…');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await wait(1500);

  // 1) Step 1: outcome picker
  await page.screenshot({
    path: path.join(OUT_DIR, 'decisioning-table-onboarding-step1.png'),
    fullPage: false,
  });
  console.log('✓ step1');

  // Click "Decline" → fill name + description
  await page.getByText('Decline', { exact: true }).first().click();
  await wait(300);
  await page.getByPlaceholder(/Enter model name/i).fill('Demo decisioning model');
  await page.getByPlaceholder(/Enter model description/i).fill('Sample model used for portfolio screenshots.');
  await wait(300);

  // Scroll inner panel down to step 3
  let scroller = await findOnboardingScroller(page);
  await scroller.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' }));
  await wait(700);

  // 2) Step 3: data element selector
  await page.screenshot({
    path: path.join(OUT_DIR, 'decisioning-table-onboarding-step3.png'),
    fullPage: false,
  });
  console.log('✓ step3');

  // Select 3 data elements
  const checks = page.locator('input[type="checkbox"]');
  const count = await checks.count();
  for (let i = 1; i <= Math.min(3, count - 1); i++) {
    await checks.nth(i).check({ force: true }).catch(() => {});
    await wait(80);
  }
  await wait(400);

  // Click "Save and create model" CTA
  const cta = page.getByRole('button', { name: /Save and create model/i });
  await cta.click({ force: true });
  await wait(2500);

  // 3) Main rules table — clip to remove excess whitespace below the table
  // Table sits roughly at y=0 to y=380 (header + 5 rows). Bottom tab bar at y~1170.
  // Capture top portion + a bit of breathing room, plus the bottom tab bar via two shots? No — single clip.
  await page.screenshot({
    path: path.join(OUT_DIR, 'decisioning-table-rules.png'),
    clip: { x: 0, y: 0, width: 1440, height: 480 },
  });
  console.log('✓ rules');

  // 4) Outcome column close-up — clip to the right portion of the table
  // The table runs roughly the full width at 1440. Outcome col is on right edge.
  await page.screenshot({
    path: path.join(OUT_DIR, 'decisioning-table-outcome-toggles.png'),
    clip: { x: 740, y: 80, width: 700, height: 280 },
  });
  console.log('✓ outcome-toggles');

  // 5) Data attribute dropdown — click the first Income badge (a real button)
  console.log('→ Click Income badge button…');
  const opened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    // First Income button inside the table body (skip header/CTA buttons)
    const incomeBtns = btns.filter((b) => b.innerText.trim() === 'Income');
    if (!incomeBtns.length) return false;
    const target = incomeBtns[0];
    // Try a real click sequence to ensure dropdown opens
    target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    target.click();
    const r = target.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  console.log('  income click:', JSON.stringify(opened));
  await wait(800);
  await page.screenshot({
    path: path.join(OUT_DIR, 'decisioning-table-data-attribute-dropdown.png'),
    fullPage: false,
  });
  console.log('✓ data-attribute-dropdown');

  // Close any open dropdown
  await page.keyboard.press('Escape');
  await wait(300);
  await page.mouse.click(10, 10); // click outside
  await wait(200);

  // 6) Split-button — click chevron on "+ Add rule"
  console.log('→ Locate Add rule button…');
  // Dump button info for debugging
  const buttons = await page.$$eval('button', (els) =>
    els.map((b) => {
      const r = b.getBoundingClientRect();
      return {
        text: b.innerText.trim().slice(0, 30),
        ariaLabel: b.getAttribute('aria-label'),
        ariaHaspopup: b.getAttribute('aria-haspopup'),
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
      };
    }).filter((b) => b.w > 0)
  );
  console.log('  buttons:', JSON.stringify(buttons));

  // Click chevron — the small button immediately right of "Add rule"
  // Find by combining text + adjacent aria-haspopup button
  const addRuleClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addRule = btns.find((b) => /add rule/i.test(b.innerText.trim()));
    if (!addRule) return null;
    // Look for sibling chevron button (aria-haspopup or has chevron-down svg)
    const parent = addRule.parentElement;
    if (!parent) return null;
    const siblings = Array.from(parent.querySelectorAll('button'));
    const chev = siblings.find((b) => b !== addRule && (b.getAttribute('aria-haspopup') || b.querySelector('svg')));
    const target = chev || addRule;
    target.click();
    const r = target.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, isChev: !!chev };
  });
  console.log('  add-rule-click:', JSON.stringify(addRuleClicked));
  await wait(700);
  await page.screenshot({
    path: path.join(OUT_DIR, 'decisioning-table-split-button.png'),
    fullPage: false,
  });
  console.log('✓ split-button');

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
