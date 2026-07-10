import { test, expect, type Page } from '@playwright/test'

// Reduced motion is set globally in playwright.config.ts, so entrance
// animations (.rise), the blinking cursor and the status-dot pulse are all
// settled by the time we capture. Waiting on document.fonts.ready keeps
// web-font swap from racing the screenshot.
async function settle(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/work', name: 'work' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/tokens', name: 'tokens' },
]

for (const { path, name } of ROUTES) {
  test(`${name} page matches baseline`, async ({ page }) => {
    await settle(page, path)
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  })
}

test('case study detail page matches baseline', async ({ page }) => {
  await settle(page, '/work/c1-decision-engine')
  // The Capital One study embeds a live external iframe (the decision-engine
  // prototype). Its content is non-deterministic and depends on an external
  // deploy, so mask the frame — the snapshot still verifies the surrounding
  // page and the embed's framed layout, without the flaky iframe contents.
  await expect(page).toHaveScreenshot('case-detail.png', {
    fullPage: true,
    mask: [page.locator('.block-embed__frame')],
  })
})
