import { defineConfig, devices } from '@playwright/test'

// Visual regression tests. Screenshots are compared against committed
// baselines in tests/visual/__screenshots__/ (linux baselines, matching CI).
// Regenerate after intentional visual changes:
//   npm run test:visual:update
export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  expect: {
    toHaveScreenshot: {
      // Freeze CSS animations mid-capture; small AA tolerance for
      // cross-machine font rendering differences.
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    // Escape hatch for environments with a system-managed Chromium
    // (e.g. PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium).
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
      : {}),
    baseURL: 'http://localhost:3000',
    viewport: { width: 1280, height: 720 },
    // globals.css honors prefers-reduced-motion: entrance fades (.rise),
    // cursor blink and status pulse all settle instantly — deterministic pixels.
    reducedMotion: 'reduce',
    colorScheme: 'dark',
  },
  webServer: {
    // Production server — dev mode injects the Next.js dev indicator into pages.
    command: 'npx next build && npx next start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
