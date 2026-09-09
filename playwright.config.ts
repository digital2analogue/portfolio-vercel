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
      // render blank and the suite would still pass.
      //
      // Measured ON THE RUNNER at the first run under this setting, three
      // baselines had drifted and were passing inside the old allowance:
      //
      //   /         22,064 px  (72% of its 30,796 px allowance)
      //   /work     31,186 px  (84% of its 37,043 px allowance)
      //   /contact   1,237 px
      //
      // /about, /tokens and /work/c1-decision-engine all came in under 200,
      // which is what makes 200 a reachable number here rather than an
      // aspiration.
      //
      // The second-order effect is worse than the missed failure:
      // `--update-snapshots` only rewrites a baseline whose comparison
      // FAILED, so anything absorbed by tolerance is never re-recorded. The
      // committed PNG quietly stops describing the code, and the next real
      // regression is measured against a stale reference. /contact is the
      // worked example: its baseline was last regenerated 2026-07-02 and
      // still reads "Available for new opportunities", while
      // app/contact/page.tsx has said "Open to work" since 534891d on
      // 2026-08-18.
      //
      // 200 matches the constant parsimony settled on against measured
      // run-to-run drift. It only holds while every baseline is
      // runner-native — regenerate via the "Update visual baselines"
      // workflow, never locally. That rule is not fussiness: the numbers
      // above were first measured in a dev container and every one of them
      // was wrong, in both directions (/ read 0 px there and 22,064 on the
      // runner; /tokens read 142,558 there and under 200 on the runner).
      // A local screenshot comparison in this repo is not evidence.
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
