import { test, expect, type Page } from '@playwright/test'

// Reduced motion settles all entrance motion (.rise, the case-body scroll
// reveal, typewriters, dither reveals) into deterministic final states.
// NOTE: the config-level `use.reducedMotion: 'reduce'` is silently ignored
// by the test runner in the pinned Playwright version (verified 2026-07:
// window.matchMedia reports no-preference inside tests, while a manually
// created context honors the same option) — so emulate it explicitly per
// page, before navigation, or JS-guarded motion sees the wrong preference
// and full-page captures freeze scroll-revealed content in its hidden state.
// Waiting on document.fonts.ready keeps web-font swap from racing the
// screenshot.
async function settle(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
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
