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
      // Freeze CSS animations mid-capture.
      animations: 'disabled',
      // ABSOLUTE, not a ratio (parsimony#235, ported here 2026-09-09).
      // maxDiffPixelRatio is a fraction of the WHOLE image, and these are
      // full-page captures, so the allowance scaled with page length into
      // numbers no regression could exceed:
      //
      //   /tokens              1280x11995  ->  0.02 = 307,072 px
      //   /work/c1-...         1280x8284   ->  0.02 = 212,070 px
      //   /about               1280x1804   ->  0.02 =  46,182 px
      //
      // 307,072 px is a 554x554 region: a whole section of /tokens could
      // render blank and the suite would still pass. Measured against the
      // committed baselines, /tokens was differing by 142,558 px and /about
      // by 25,509 px — both silently inside the allowance.
      //
      // The second-order effect is worse than the missed failure:
      // `--update-snapshots` only rewrites a baseline whose comparison
      // FAILED, so anything absorbed by tolerance is never re-recorded. The
      // committed PNG quietly stops describing the code, and the next real
      // regression is measured against a stale reference. /contact's
      // baseline predates an 2026-08-18 copy change for exactly this reason.
      //
      // 200 matches the constant parsimony settled on against measured
      // run-to-run drift, and is 2x the value portfolio-art already runs
      // green on for comparably tall full-page captures. It only holds while
      // every baseline is runner-native — regenerate via the "Update visual
      // baselines" workflow, never locally.
      maxDiffPixels: 200,
      threshold: 0.2,
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
