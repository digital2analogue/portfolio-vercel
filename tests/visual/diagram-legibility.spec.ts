import { test, expect, type Page } from '@playwright/test'

/**
 * Guards the diagram floor width.
 *
 * Every case-study diagram is authored on a ~1240px canvas. Left to
 * `width: 100%`, one renders at 358px in a 390px viewport — scale 0.29, which
 * put the smallest labels at 3.0–3.9px across all eleven diagrams. The fix in
 * globals.css is a `min-width` floor on the SVG plus a scrollable host, so a
 * diagram never renders smaller than it does in the full desktop column.
 *
 * The first attempt at that fix lived in `@media (max-width: 700px)` and left
 * a cliff: at 701px the rule switched off but the case column was still far
 * narrower than the floor, so a tablet rendered labels at 5.5px — worse than
 * the phone the rule was written for. That is why this asserts across a
 * continuous range of widths rather than at one "mobile" width.
 *
 * No screenshots — this asserts geometry, so it never needs a baseline regen.
 */

const ROUTES = ['/work/system', '/work/ot-reservations']
const WIDTHS = [320, 390, 700, 701, 834, 1000, 1280, 1600]

/** Must stay in sync with `--diagram-floor` in globals.css. */
const FLOOR = 900

type Row = {
  i: number
  svgW: number
  overflow: number
  focusable: boolean
  hasHint: boolean
}

async function probe(page: Page) {
  return page.evaluate(() => {
    const rows = []
    const figs = document.querySelectorAll('.block-diagram')
    for (let i = 0; i < figs.length; i++) {
      const fig = figs[i]
      const host = fig.querySelector<HTMLElement>('.block-diagram__host')!
      const svg = fig.querySelector('svg')!
      rows.push({
        i,
        svgW: Math.round(svg.getBoundingClientRect().width),
        overflow: host.scrollWidth - host.clientWidth,
        focusable: host.getAttribute('tabindex') === '0',
        hasHint: !!fig.querySelector('.block-diagram__hint'),
      })
    }
    const doc = document.documentElement
    return { rows, pageOverflowX: doc.scrollWidth - doc.clientWidth }
  }) as Promise<{ rows: Row[]; pageOverflowX: number }>
}

for (const route of ROUTES) {
  test(`diagrams on ${route} never render below the floor width`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route, { waitUntil: 'networkidle' })
      // The overflow measurement drives tabindex/hint via a ResizeObserver.
      await page.waitForTimeout(250)
      const { rows, pageOverflowX } = await probe(page)

      expect(rows.length, `no diagrams found on ${route}`).toBeGreaterThan(0)

      for (const r of rows) {
        // 1px slack for sub-pixel layout rounding.
        expect(
          r.svgW,
          `${route} @${width}px — diagram ${r.i} rendered ${r.svgW}px, below the ${FLOOR}px floor`
        ).toBeGreaterThanOrEqual(FLOOR - 1)

        // The affordance must not claim a diagram pans when it doesn't, or
        // hide the keyboard route when it does (WCAG 2.1.1).
        const pans = r.overflow > 1
        expect(
          { focusable: r.focusable, hint: r.hasHint },
          `${route} @${width}px — diagram ${r.i} overflow=${r.overflow}; affordances disagree`
        ).toEqual({ focusable: pans, hint: pans })
      }

      // Panning is contained to the figure — the page itself never scrolls sideways.
      expect(pageOverflowX, `${route} @${width}px — page scrolls horizontally`).toBeLessThanOrEqual(0)
    }
  })
}
