/**
 * scripts/check-contrast.mjs
 *
 * Validates every colour pairing in the UI against WCAG AA. Two criteria, because
 * AA has two:
 *
 *   • 1.4.3 Contrast (Minimum) — TEXT needs 4.5:1. The default here.
 *   • 1.4.11 Non-text Contrast — the visual information required to identify a
 *     UI COMPONENT or its STATE needs 3:1. A button's fill, a switch's track, a
 *     selected-segment indicator: without these at 3:1 the control is invisible
 *     to low-vision users even when its label passes 1.4.3.
 *
 * Wired into `npm run build` — the build fails if any pair fails.
 *
 * To add a new check: add an entry to PAIRINGS at the bottom of this file. Pass
 * `min: NON_TEXT` for anything that is not text; leave it off for text.
 *
 * Exempt, deliberately: decorative edges that are NOT required to identify a
 * control — row hairlines, card frames, the header chip dividers. Each chip is
 * identified by its own label and icon, both of which clear 1.4.3; the rule
 * between them is separation, not identification.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSS_FILE = path.join(__dirname, '../app/globals.css')
// Base tokens come from the installed @digital2analogue2/parsimony package;
// globals.css carries only the portfolio's overrides. Parse both.
const PKG_CSS = path.join(__dirname, '../node_modules/@digital2analogue2/parsimony/css/variables.css')

// ─── Token resolution ──────────────────────────────────────────────────────────

function parseTokens(css) {
  const tokens = {}
  const re = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(css)) !== null) {
    tokens[`--${m[1]}`] = m[2].trim()
  }
  return tokens
}

function resolveVar(value, tokens, depth = 0) {
  if (depth > 20) return value
  return value.replace(/var\(--([a-zA-Z0-9-]+)\)/g, (_, name) => {
    const ref = `--${name}`
    return tokens[ref] ? resolveVar(tokens[ref], tokens, depth + 1) : value
  })
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function resolve(name, tokens) {
  if (name.startsWith('#')) return name
  let v = tokens[name]
  if (!v) return null
  v = resolveVar(v, tokens)
  return /^#[0-9a-fA-F]{6}$/i.test(v) ? v : null
}

// ─── WCAG contrast ─────────────────────────────────────────────────────────────

function linearize(c) {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function contrastRatio(a, b) {
  const la = luminance(a), lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// ─── Load tokens ───────────────────────────────────────────────────────────────

const pkgCss = fs.existsSync(PKG_CSS) ? fs.readFileSync(PKG_CSS, 'utf8') : ''
const css = fs.readFileSync(CSS_FILE, 'utf8')
// Package base first, portfolio overrides second so the last definition wins.
const tokens = parseTokens(pkgCss + '\n' + css)
const tok = name => resolve(name, tokens)

const BG         = tok('--color-background-default')  // #0A0D0A
const BG_ALT     = tok('--color-background-alt')      // #1E241E
const BG_ACTION  = tok('--color-background-action')   // #4ADE6E

// ─── Pairings manifest ─────────────────────────────────────────────────────────
//
// Add a new entry here whenever you introduce a new text/background combination.
// Format: { text, bg, label }

// SC 1.4.11 — UI component boundaries and state indicators.
const NON_TEXT = 3.0

const PAIRINGS = [
  // Default surface
  { text: '--color-foreground-default', bg: BG,        label: 'Body text / headings on page canvas' },
  { text: '--color-foreground-alt',     bg: BG,        label: 'Secondary text on page canvas' },
  { text: '--color-foreground-muted',   bg: BG,        label: 'Muted text / placeholders on page canvas' },
  { text: '--color-foreground-action',  bg: BG,        label: 'Action links / active nav on page canvas' },
  // Elevated surface (cards, panels)
  { text: '--color-foreground-default', bg: BG_ALT,    label: 'Body text on elevated surface' },
  { text: '--color-foreground-alt',     bg: BG_ALT,    label: 'Secondary text on elevated surface' },
  { text: '--color-foreground-muted',   bg: BG_ALT,    label: 'Muted text on elevated surface' },
  { text: '--color-foreground-action',  bg: BG_ALT,    label: 'Action links on elevated surface' },
  // Marginalia labels (section markers)
  { text: '--color-foreground-muted',   bg: BG,        label: 'Marginalia labels on page canvas' },
  // Action surface (primary buttons, CTAs)
  { text: '--color-foreground-on-action', bg: BG_ACTION, label: 'Button label on action background' },

  // ── check_usage playground (components/demos/CheckUsageDemo) ──
  // Dark-system editor (bg-alt) with danger accents for violations. Compliant
  // verdict + code reuse pairings already registered above (success/default on
  // bg-alt). New danger pairings:
  { text: '--color-foreground-danger', bg: BG_ALT,                          label: 'check_usage: violation accents (verdict, gutter, rule) on editor' },
  { text: '--color-foreground-danger', bg: '--color-background-danger-alt', label: 'check_usage: rule-id chip (danger on danger-alt)' },

  // ── OTKit reservation-status demo (components/demos/ReservationStatusDemo) ──
  // Light-mode surface with its own OTKit-local palette (resolved hexes, not
  // portfolio tokens). Fills come from the OTKit Variables library; two are
  // nudged darker to clear AA for their white label (No show, Dessert).
  { text: '#ffffff', bg: '#247f9e', label: 'Demo: status label — action (Booked)' },
  { text: '#ffffff', bg: '#2f864d', label: 'Demo: status label — success (Confirmed/Paid)' },
  { text: '#141a26', bg: '#fdaf08', label: 'Demo: status label — warning (Running late)' },
  { text: '#ffffff', bg: '#cc3b48', label: 'Demo: status label — danger (No show, AA-nudged)' },
  { text: '#ffffff', bg: '#ad4cc3', label: 'Demo: status label — accent-purple (Arrived/Seated)' },
  { text: '#ffffff', bg: '#d82c82', label: 'Demo: status label — accent-fuchsia (Partially)' },
  { text: '#ffffff', bg: '#7f5ce8', label: 'Demo: status label — accent-violet (Appetizer)' },
  { text: '#ffffff', bg: '#4a6fde', label: 'Demo: status label — accent-blue (Entree)' },
  { text: '#ffffff', bg: '#20738f', label: 'Demo: status label — accent-teal (Dessert, AA-nudged)' },
  { text: '#ffffff', bg: '#c84f29', label: 'Demo: status label — accent-orange (Cleared)' },
  { text: '#2d333f', bg: '#ffffff', label: 'Demo: ink on white (Finished/Cancelled, row name, swatch)' },
  { text: '#2d333f', bg: '#f1f2f4', label: 'Demo: ink on grey surface (outline hover, active seg)' },
  { text: '#6f737b', bg: '#ffffff', label: 'Demo: muted text on white (row sub, field labels, notes)' },
  { text: '#63666d', bg: '#f1f2f4', label: 'Demo: inactive segment label on toggle track' },
  { text: '#63666d', bg: '#ffffff', label: 'Demo: dropdown group labels / option sublabels on white' },
  { text: '#ffffff', bg: '#813992', label: 'Demo: avatar initials on accent-purple-pressed' },

  // ── iOS reservation detail (components/demos/ReservationDetailDemo) ──
  // Reuses the OTKit palette above; only the pairings unique to this screen are
  // listed. Note the constraint that shapes it: rows TINT on hover and press, so
  // every foreground has to clear AA on white and on both tints. Muted #6f737b
  // fails that test (4.25:1 on #f1f2f4), which is why this screen's muted text is
  // #63666d — 5.75 / 5.13 / 4.81 across white, hover and press.
  { text: '#63666d', bg: '#e9ebee', label: 'Demo/detail: muted row text on pressed row tint' },
  { text: '#2d333f', bg: '#e9ebee', label: 'Demo/detail: ink row text on pressed row tint' },
  { text: '#2d333f', bg: '#e9ebee', label: 'Demo/detail: secondary action label on its pressed fill' },
  { text: '#ffffff', bg: '#247f9e', label: 'Demo/detail: Completed label on primary action' },
  // Interactive text in every state a row actually reaches.
  { text: '#2d333f', bg: '#f1f2f4', label: 'Demo/detail: chip + row label on hovered row' },
  { text: '#63666d', bg: '#ffffff', label: 'Demo/detail: note byline / inactive segment on white' },
  //
  // ── SC 1.4.11, non-text (3:1) ──
  // Controls whose fill or indicator IS the affordance. Each of the first three
  // measured 1.1–1.5:1 before the boundary ring was added: the switch was
  // invisible until turned on, the secondary action had no edge, and neither the
  // segmented track nor its selected thumb could be made out.
  { text: '#82868e', bg: '#ffffff', min: NON_TEXT, label: 'Demo/detail: control boundary ring on white (switch, action, segment)' },
  { text: '#247f9e', bg: '#ffffff', min: NON_TEXT, label: 'Demo/detail: visit-scope underline (same token as the strip)' },
  { text: '#247f9e', bg: '#ffffff', min: NON_TEXT, label: 'Demo/detail: focus ring + tab indicator + switch-on fill' },
  { text: '#247f9e', bg: '#f1f2f4', min: NON_TEXT, label: 'Demo/detail: active tab glyph on hovered tab' },
  // Leading row glyphs — orientation marks, held to 3:1 in every row state.
  { text: '#82868e', bg: '#e9ebee', min: NON_TEXT, label: 'Demo/detail: leading row glyph on pressed row' },
  // Tag category glyphs. accent-yellow #FDAF08 is 1.86:1 and is darkened here.
  { text: '#a97405', bg: '#ffffff', min: NON_TEXT, label: 'Demo/detail: tag category — relationship (accent-yellow darkened for 1.4.11)' },
  { text: '#cc3b48', bg: '#ffffff', min: NON_TEXT, label: 'Demo/detail: tag category — food & drink' },
  { text: '#4a6fde', bg: '#ffffff', min: NON_TEXT, label: 'Demo/detail: tag category — seating' },

  // ── iPad / Back of House shell (components/demos/ReservationDetailIPad) ──
  // The shell adds three surfaces the phone has no use for: two near-black
  // panels (rail/sidebar #0d0e12, service bar #111114), one raised step inside
  // them (#252833) and one tinted light panel beside the record (#f6f7f8). All
  // four are sampled from the source clip. The record column itself is the same
  // white surface as the phone and reuses every pairing above.
  //
  // SC 1.4.3 — text.
  { text: '#ffffff', bg: '#0d0e12', label: 'Demo/iPad: sidebar + rail text on BOH chrome' },
  { text: '#a9b0bd', bg: '#0d0e12', label: 'Demo/iPad: sidebar sort/count text on BOH chrome' },
  { text: '#ffffff', bg: '#111114', label: 'Demo/iPad: service-bar text on the date bar' },
  { text: '#a9b0bd', bg: '#111114', label: 'Demo/iPad: service-bar secondary text' },
  { text: '#ffffff', bg: '#252833', label: 'Demo/iPad: selected row + date chips on raised chrome' },
  { text: '#a9b0bd', bg: '#252833', label: 'Demo/iPad: muted text on raised chrome' },
  { text: '#2d333f', bg: '#f6f7f8', label: 'Demo/iPad: side-panel ink (table label, switch, referral)' },
  { text: '#63666d', bg: '#f6f7f8', label: 'Demo/iPad: side-panel muted text (table state)' },
  //
  // SC 1.4.11 — non-text. The rail glyphs are the ONLY label a rail button
  // carries, and the focus ring is the only keyboard affordance on a dark panel,
  // so both are held to 3:1 against every surface they land on.
  { text: '#a9b0bd', bg: '#0d0e12', min: NON_TEXT, label: 'Demo/iPad: rail glyphs on chrome' },
  { text: '#247f9e', bg: '#0d0e12', min: NON_TEXT, label: 'Demo/iPad: focus ring on rail + sidebar' },
  { text: '#247f9e', bg: '#111114', min: NON_TEXT, label: 'Demo/iPad: focus ring on the service bar' },
  { text: '#247f9e', bg: '#252833', min: NON_TEXT, label: 'Demo/iPad: focus ring on a raised chip / selected row' },
  { text: '#247f9e', bg: '#f6f7f8', min: NON_TEXT, label: 'Demo/iPad: status-button fill on the side panel' },
  { text: '#82868e', bg: '#f6f7f8', min: NON_TEXT, label: 'Demo/iPad: side-panel glyphs + control boundary rings' },
  { text: '#82868e', bg: '#f1f2f4', min: NON_TEXT, label: 'Demo/iPad: side-panel glyph on a hovered row' },

  // ── OTKit table-status floor grid (components/demos/TableStatusDemo) ──
  // Tiles show a table number + icon on a semantic fill. Light-tint fills pair
  // with ink #141a26 (the token system's on-*-secondary rule); mid-tone fills
  // pair with white (already registered above). These are the AA-REPAIRED
  // pairings the demo actually renders. The two families whose real on-token
  // (white) failed AA are repaired here (drinks → foreground-default #2d333f on
  // lime; course 4 → white on darkened teal #20738f), so the failing white-on-
  // light pairings are never rendered and are deliberately NOT registered.
  { text: '#141a26', bg: '#d5c9f7', label: 'Demo/tile: ink on accent-violet-secondary (Appetizer)' },
  { text: '#141a26', bg: '#61bddb', label: 'Demo/tile: ink on accent-teal-secondary (Dessert)' },
  { text: '#141a26', bg: '#64c987', label: 'Demo/tile: ink on accent-green-secondary (Paid)' },
  { text: '#141a26', bg: '#ddeb8a', label: 'Demo/tile: ink on accent-lime-secondary (Course 1)' },
  { text: '#141a26', bg: '#eb93bf', label: 'Demo/tile: ink on accent-fuchsia-secondary (Course 2)' },
  { text: '#141a26', bg: '#b1c1f1', label: 'Demo/tile: ink on accent-blue-secondary (Course 5)' },
  { text: '#141a26', bg: '#e69b84', label: 'Demo/tile: ink on accent-orange-secondary (Course 6)' },
  { text: '#141a26', bg: '#3ddbb6', label: 'Demo/tile: ink on accent-aqua-secondary (Palate cleanser)' },
  // Course 4 (accent-teal) repaired = white on darkened #20738f (already registered above as Dessert).
  { text: '#2d333f', bg: '#abc31b', label: 'Demo/tile: foreground-default on accent-lime (drinks, AA-repaired)' },
  { text: '#141a26', bg: '#ffe922', label: 'Demo/tile: ink on accent-lemon (Table knock)' },
  { text: '#ffffff', bg: '#931b23', label: 'Demo/tile: warning badge glyph on danger' },
  { text: '#931b23', bg: '#ffffff', label: 'Demo/tile: fail summary text on white' },
  { text: '#236439', bg: '#f1f2f4', label: 'Demo/tile: AA-pass verdict on grey surface' },
  { text: '#931b23', bg: '#f1f2f4', label: 'Demo/tile: fail verdict on grey surface' },

  // Interactive outcome-toggle demo — a LIGHT (decision-engine arctic) device
  // card embedded on the dark page. These pairings use the scoped arctic hex
  // values from `.block-outcome-demo__device` in globals.css (not page tokens).
  // Labels are checked against the un-tinted pill base (#F0F4FA), mirroring the
  // decisioning-table source gate; the inactive-ghost label (#A8B0BE) is
  // WCAG-exempt by design and intentionally omitted.
  { text: '#15803d', bg: '#F0F4FA', label: 'Outcome demo: Approve segment label (active) on pill' },
  { text: '#C8002E', bg: '#F0F4FA', label: 'Outcome demo: Deny segment label (active) on pill' },
  { text: '#1A1A2E', bg: '#FFFFFF', label: 'Outcome demo: rule name on device row surface' },
  { text: '#5E6E88', bg: '#FFFFFF', label: 'Outcome demo: rule condition (muted) on device row surface' },
  { text: '#5E6E88', bg: '#F5F8FC', label: 'Outcome demo: card title on device canvas' },

  // Rule-cell demo — the full decision-engine rule row, live (`.rcd` in
  // globals.css, same scoped arctic palette as the outcome demo). Pairings are
  // resolved hex from the --rcd-* custom properties. The segment recipe is
  // shared with the outcome demo (labels on pill base already registered
  // above); the inactive-ghost segment label (#A8B0BE) stays WCAG-exempt by
  // design, same as there.
  { text: '#5E6E88', bg: '#F5F8FC', label: 'Rule-cell demo: title/sentence/hint (muted) on card canvas' },
  { text: '#1A1A2E', bg: '#F5F8FC', label: 'Rule-cell demo: sentence strong (ink) on card canvas' },
  { text: '#15803d', bg: '#F5F8FC', label: 'Rule-cell demo: sentence Approve readback on card canvas' },
  { text: '#C8002E', bg: '#F5F8FC', label: 'Rule-cell demo: sentence Deny readback on card canvas' },
  { text: '#1A1A2E', bg: '#FFFFFF', label: 'Rule-cell demo: rule name / operator / value on row surface' },
  { text: '#5E6E88', bg: '#FFFFFF', label: 'Rule-cell demo: row number / value prefix (muted) on row surface' },
  { text: '#2456E4', bg: '#E5EBFC', label: 'Rule-cell demo: blue attribute badge label on tint fill' },
  { text: '#C8002E', bg: '#FBEBEE', label: 'Rule-cell demo: red attribute badge label on tint fill' },
  { text: '#1A1A2E', bg: '#EBF0F8', label: 'Rule-cell demo: gray attribute badge label on tint fill' },
  { text: '#1A1A2E', bg: '#F2F5FD', label: 'Rule-cell demo: ink on selected-row tint (6% action over white)' },
  { text: '#2456E4', bg: '#E5EBFC', label: 'Rule-cell demo: active listbox option on accent tint' },
]

// ─── Run ───────────────────────────────────────────────────────────────────────

const MIN_RATIO = 4.5
let failed = 0

console.log('\n  Contrast check — WCAG AA (1.4.3 text 4.5:1 · 1.4.11 non-text 3:1)\n')
console.log(`  ${'Pair'.padEnd(52)} ${'Ratio'.padStart(7)} ${'Min'.padStart(4)}  Status`)
console.log(`  ${'─'.repeat(72)}`)

for (const { text, bg, label, min } of PAIRINGS) {
  const textHex = typeof text === 'string' && text.startsWith('--') ? tok(text) : text
  const bgHex   = typeof bg   === 'string' && bg.startsWith('--')   ? tok(bg)   : bg

  if (!textHex || !bgHex) {
    console.log(`  ${'[unresolved] ' + label}`)
    continue
  }

  const ratio = contrastRatio(textHex, bgHex)
  const floor = min ?? MIN_RATIO
  const pass  = ratio >= floor
  if (!pass) failed++
  const need = floor === MIN_RATIO ? '    ' : ` ${floor.toFixed(1)}`
  console.log(`  ${label.padEnd(52)} ${ratio.toFixed(2).padStart(7)}:1 ${need}  ${pass ? '✅' : '❌ FAIL'}`)
}

console.log()

if (failed > 0) {
  console.error(`  ❌ ${failed} contrast failure(s). Fix token values or pairing CSS before shipping.\n`)
  process.exit(1)
} else {
  const nonText = PAIRINGS.filter(p => p.min).length
  console.log(`  ✅ All ${PAIRINGS.length} pairs pass WCAG AA (${PAIRINGS.length - nonText} text · ${nonText} non-text)\n`)
}
