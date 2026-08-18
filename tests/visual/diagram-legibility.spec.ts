import { test, expect, type Page } from '@playwright/test'

/**
 * Guards how case-study diagrams behave at every viewport width.
 *
 * Every diagram is authored on a ~1240px canvas, which no phone can render
 * legibly inline. Two earlier approaches are encoded here as things that must
 * NOT come back:
 *
 *  1. Shrink-to-fit with no escape hatch. At 390px that put the smallest
 *     labels at 3.0–3.9px across all eleven diagrams.
 *  2. Pan inline, via a `min-width` floor on a scrolling host. Legible, but it
 *     cut each diagram off mid-sentence and made reading the page a sideways
 *     scrub — worse than the problem it solved.
 *
 * What ships: the diagram fits its column (so the page reads normally and
 * never scrolls sideways) and is a zoom trigger; the overlay holds the
 * legibility floor, because panning is expected in a viewer and intolerable
 * in a page.
 *
 * No screenshots — geometry and roles only, so this never needs a baseline
 * regen.
 */

const ROUTES = ['/work/system', '/work/ot-reservations']
const WIDTHS = [320, 390, 700, 701, 834, 1000, 1280, 1600]

/** Must stay in sync with `.lightbox--diagram img { min-width }` in globals.css. */
const FLOOR = 900

async function probe(page: Page) {
  return page.evaluate(() => {
    const figs = [...document.querySelectorAll('.block-diagram')]
    const doc = document.documentElement
    return {
      count: figs.length,
      rows: figs.map((fig, i) => {
        const trigger = fig.querySelector<HTMLElement>('.block-diagram__trigger')
        const svg = fig.querySelector('svg')!
        const r = svg.getBoundingClientRect()
        return {
          i,
          svgW: Math.round(r.width),
          colW: Math.round((fig as HTMLElement).getBoundingClientRect().width),
          focusable: trigger?.getAttribute('tabindex') === '0',
          role: trigger?.getAttribute('role') ?? null,
          label: trigger?.getAttribute('aria-label') ?? null,
        }
      }),
      pageOverflowX: doc.scrollWidth - doc.clientWidth,
    }
  })
}

for (const route of ROUTES) {
  test(`diagrams on ${route} fit their column at every width`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route, { waitUntil: 'networkidle' })
      await page.waitForTimeout(200)
      const { count, rows, pageOverflowX } = await probe(page)

      expect(count, `no diagrams found on ${route}`).toBeGreaterThan(0)

      for (const r of rows) {
        // Fits: never wider than the column it sits in (1px layout slack).
        expect(
          r.svgW,
          `${route} @${width}px — diagram ${r.i} is ${r.svgW}px in a ${r.colW}px column; it should fit, not pan`
        ).toBeLessThanOrEqual(r.colW + 1)

        // The escape hatch has to exist and be keyboard-reachable (WCAG 2.1.1),
        // because fitting alone is illegible on a phone.
        expect(
          { focusable: r.focusable, role: r.role, hasLabel: !!r.label },
          `${route} @${width}px — diagram ${r.i} has no keyboard-reachable zoom trigger`
        ).toEqual({ focusable: true, role: 'button', hasLabel: true })
      }

      expect(pageOverflowX, `${route} @${width}px — page scrolls horizontally`).toBeLessThanOrEqual(0)
    }
  })

  test(`diagram overlay on ${route} holds the legibility floor`, async ({ page }) => {
    // 390px is the case the floor exists for: fitting here is 3–4px labels.
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(route, { waitUntil: 'networkidle' })

    const trigger = page.locator('.block-diagram__trigger').first()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()

    const overlay = page.locator('.lightbox--diagram')
    await expect(overlay).toBeVisible()

    const img = overlay.locator('img')
    await img.waitFor({ state: 'visible' })
    const w = await img.evaluate((el) => Math.round(el.getBoundingClientRect().width))
    expect(w, `overlay rendered the diagram at ${w}px, below the ${FLOOR}px floor`).toBeGreaterThanOrEqual(FLOOR - 1)

    // Escape closes and the trigger takes focus back.
    await page.keyboard.press('Escape')
    await expect(overlay).toHaveCount(0)
  })
}
