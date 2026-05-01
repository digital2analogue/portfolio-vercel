// Captures four interaction states of the decisioning-table prototype
// and writes PNGs into /public/images/cases.
//
// Run: node scripts/capture-decisioning-table.mjs
// Requires: npx playwright install chromium (one-time)

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "images", "cases");
const URL = "https://decisioning-table.vercel.app/";

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

const shot = (name) => page.screenshot({ path: resolve(OUT_DIR, name) });
const log = (msg) => console.log(`[capture] ${msg}`);

await page.goto(URL, { waitUntil: "networkidle" });

// 1) Onboarding — outcome picker (six cards visible)
log("step 1: onboarding outcome picker");
await page.waitForSelector("text=Assign an outcome for ruleset");
await shot("decisioning-onboarding.png");

// Walk through onboarding to reach the table.
// Each "outcome" card has a radio + heading + description.
// Click the description text — its parent card area handles selection.
await page.getByText("Decline the applicant and assign turndown reasons").click();

await page.getByPlaceholder("Enter model name").fill("Demo Decline Model");
await page
  .getByPlaceholder("Enter model description")
  .fill("A demo decline rule for screenshots");

// Pick the first data element checkbox so step 3 validates
const annualIncomeRow = page.locator("label, tr, div", { hasText: "AnnualIncome" }).first();
await annualIncomeRow.locator("input[type=checkbox]").first().check();

// CTA shows "Next" while steps remain incomplete and flips to
// "Save and create model" once all three are filled.
await page
  .locator("button", { hasText: /Save and create model|^Next$/ })
  .first()
  .click();

// 2) Main table view
log("step 2: main table view");
await page.waitForSelector("text=Demo Decline Model", { timeout: 15000 });
// Let any row-enter animations settle
await page.waitForTimeout(800);
await shot("decisioning-table.png");

// All data rows live inside tbody. Rule names live inside <input> elements,
// so locator text filters won't match them — index by position instead.
const dataRows = page.locator("tbody tr");

// 3) Data attribute dropdown open on row 2
log("step 3: data-attribute dropdown");
const row2 = dataRows.nth(1);
await row2.locator("text=Income").first().click();
// The dropdown lists Income / Expense / Asset / Liability
await page.waitForSelector("text=Liability");
await page.waitForTimeout(200);
await shot("decisioning-attribute-dropdown.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(200);

// 4) Conditional cell — Existing Account on row 1 opens operator + variable picker
log("step 4: conditional cell with operator + variable picker");
const row1 = dataRows.nth(0);
// Columns: select | # | rule name | data attribute | operator | amount |
//   existing account | annual income | outcome
const existingAccountCell = row1.locator("td").nth(6);
await existingAccountCell.click();
// Wait for the variable picker (descriptions appear next to AnnualIncome)
await page.waitForSelector("text=Annual gross income");
await page.waitForTimeout(200);
await shot("decisioning-conditional-cell.png");

log(`saved 4 screenshots to ${OUT_DIR}`);

await browser.close();
