import { test, expect, type Page } from '@playwright/test'

/**
 * Rendered-DOM guard for the `.blocks` specificity leak.
 *
 * `app/globals.css` styles bare `p`/`ul`/`li`/`h2`–`h4` under `.blocks` at
 * (0,1,1)–(0,1,3). A demo component's own single-class rule is (0,1,0) and
 * loses, so a demo silently inherits the case body's serif prose font, its
 * dark-theme foreground colours and its green `›` list marker. This has
 * shipped three separate times.
 *
 * The build-time contrast gate cannot see it. The gate validates *declared*
 * token pairings; a cascade leak substitutes a different value at render time
 * than the CSS declared, and it composites against whatever ancestor actually
 * paints — including a gradient the gate reads as `#ffffff`. Only measuring the
 * rendered DOM catches this class, which is why it lives here rather than in
 * `scripts/check-contrast.mjs`.
 *
 * No screenshots — this asserts computed values, so it never needs a baseline
 * regen.
 */

const ROUTES = [
  '/work/system',
  '/work/c1-decision-engine',
  '/work/ot-reservations',
  '/work/ot-design-system',
]

/** Verified non-leaks. Each needs a reason; an empty allowlist is the goal. */
const ALLOW: { match: RegExp; why: string }[] = [
  {
    // `.rr-demo-sr` is a 1px-clipped aria-live region: never visible, so it
    // inherits the case body harmlessly.
    match: /\brr-demo-sr\b/,
    why: 'visually-hidden live region (1px clip)',
  },
]

type Row = {
  route: string
  sel: string
  font: string
  size: number
  color: string
  bg: string
  ratio: number
  marker: string | null
  text: string
}

async function auditDemos(page: Page): Promise<Row[]> {
  return page.evaluate(() => {
    const ch = (v: number) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }
    const lum = (c: number[]) => 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])
    const parse = (s: string) => {
      const m = s?.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
      return m ? { c: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] } : null
    }
    const hex = (c: number[]) =>
      '#' + c.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')
    const over = (fg: { c: number[]; a: number }, bg: number[]) =>
      fg.c.map((v, i) => v * fg.a + bg[i] * (1 - fg.a))
    const ratio = (a: number[], b: number[]) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
      return (hi + 0.05) / (lo + 0.05)
    }

    /* Composite translucent ancestors down to the first opaque paint. A
       gradient counts as its DARKEST declared stop — the worst case the text
       actually sits on, which is how `.demo-frame__surface` (white → #f4f6f8)
       turned an on-paper 4.76:1 into a real 4.39:1. */
    const effBg = (el: Element) => {
      const layers: { c: number[]; a: number }[] = []
      let n: Element | null = el
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n)
        const img = cs.backgroundImage
        if (img && img !== 'none') {
          const stops = [...img.matchAll(/rgba?\([^)]+\)/g)]
            .map((m) => parse(m[0]))
            .filter((p): p is { c: number[]; a: number } => !!p && p.a > 0.95)
          if (stops.length) {
            layers.push(stops.sort((a, b) => lum(a.c) - lum(b.c))[0])
            break
          }
        }
        const p = parse(cs.backgroundColor)
        if (p && p.a > 0.001) {
          layers.push(p)
          if (p.a > 0.99) break
        }
        n = n.parentElement
      }
      let base = [10, 13, 10] // page canvas
      for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base)
      return base
    }

    const rows = []
    for (const frame of document.querySelectorAll('.demo-frame, .block-outcome-demo')) {
      const els = frame.querySelectorAll('p, ul, ol, li, h2, h3, h4, h5, h6, blockquote, dt, dd')
      for (const el of els) {
        if (!el.getClientRects().length) continue
        const cs = getComputedStyle(el)
        const fgp = parse(cs.color)
        if (!fgp) continue
        const bg = effBg(el)
        const fg = over(fgp, bg)
        const before = getComputedStyle(el, '::before')
        const content = before.content
        // Only the element's OWN text nodes — `color` paints nothing else.
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent)
          .join('')
          .trim()
        rows.push({
          route: location.pathname,
          sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
          font: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
          size: parseFloat(cs.fontSize),
          weight: cs.fontWeight,
          color: hex(fg),
          bg: hex(bg),
          ratio: +ratio(fg, bg).toFixed(2),
          marker: content && !['none', 'normal', '""'].includes(content) ? content : null,
          text: own.replace(/\s+/g, ' ').slice(0, 60),
          // WCAG 1.4.3: 3:1 for large text (≥24px, or ≥18.66px bold), else 4.5:1.
          min: parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700) ? 3 : 4.5,
        })
      }
    }
    return rows
  }) as Promise<Row[]>
}

async function settle(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'networkidle' })
  // Demos gate their entrance on scroll-in; nothing measures until they render.
  await page.evaluate(async () => {
    for (const el of document.querySelectorAll('.demo-frame, .blocks figure')) {
      el.scrollIntoView({ block: 'center' })
      await new Promise((r) => setTimeout(r, 30))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
}

const allowed = (sel: string) => ALLOW.some((a) => a.match.test(sel))
const fmt = (r: Row & { min?: number }) =>
  `${r.route}  ${r.sel}\n    ${r.font} ${r.size}px  ${r.color} on ${r.bg}  ${r.ratio}:1  "${r.text}"`

for (const route of ROUTES) {
  test(`demos on ${route} do not inherit the case body`, async ({ page }) => {
    await settle(page, route)
    const rows = await auditDemos(page)
    expect(rows.length, 'found no demo content to audit — did a selector change?').toBeGreaterThan(0)

    // The case body's serif is Spectral; every demo sets its own face.
    const serif = rows.filter((r) => /Spectral/i.test(r.font) && !allowed(r.sel))
    expect(serif.map(fmt), 'demo text inherited `.blocks` serif prose').toEqual([])

    // `.blocks ul li::before` paints a green "›" at (0,1,3).
    const chevron = rows.filter((r) => r.marker?.includes('›') && !allowed(r.sel))
    expect(chevron.map(fmt), 'demo list inherited the `.blocks` "›" marker').toEqual([])
  })

  test(`demo text on ${route} meets WCAG AA as rendered`, async ({ page }) => {
    await settle(page, route)
    const rows = (await auditDemos(page)) as (Row & { min: number })[]
    const fails = rows.filter((r) => r.text && r.ratio < r.min && !allowed(r.sel))
    expect(fails.map(fmt), 'rendered contrast below WCAG 1.4.3').toEqual([])
  })
}
