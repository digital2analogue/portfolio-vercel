/**
 * scripts/check-contrast.mjs
 *
 * Validates every text/background color pairing in the UI against WCAG AA (4.5:1).
 * Wired into `npm run build` — the build fails if any pair fails.
 *
 * To add a new check: add an entry to PAIRINGS at the bottom of this file.
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

  // ── OTKit table-status floor grid (components/demos/TableStatusDemo) ──
  // Tiles show a table number + icon on a semantic fill. Light-tint fills pair
  // with ink #141a26 (the token system's on-*-secondary rule); mid-tone fills
  // pair with white (already registered above). These are the AA-REPAIRED
  // pairings — the demo's default state. The two intentionally-failing "Before"
  // pairings (white on teal #2b9abf 3.24:1, white on lime #abc31b 1.99:1) are
  // shown ONLY when the viewer toggles to "Before" as the audit's subject and
  // are deliberately NOT registered here.
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
]

// ─── Run ───────────────────────────────────────────────────────────────────────

const MIN_RATIO = 4.5
let failed = 0

console.log('\n  Contrast check — WCAG AA (4.5:1 minimum)\n')
console.log(`  ${'Pair'.padEnd(52)} ${'Ratio'.padStart(7)}  Status`)
console.log(`  ${'─'.repeat(72)}`)

for (const { text, bg, label } of PAIRINGS) {
  const textHex = typeof text === 'string' && text.startsWith('--') ? tok(text) : text
  const bgHex   = typeof bg   === 'string' && bg.startsWith('--')   ? tok(bg)   : bg

  if (!textHex || !bgHex) {
    console.log(`  ${'[unresolved] ' + label}`)
    continue
  }

  const ratio = contrastRatio(textHex, bgHex)
  const pass  = ratio >= MIN_RATIO
  if (!pass) failed++
  console.log(`  ${label.padEnd(52)} ${ratio.toFixed(2).padStart(7)}:1  ${pass ? '✅' : '❌ FAIL'}`)
}

console.log()

if (failed > 0) {
  console.error(`  ❌ ${failed} contrast failure(s). Fix token values or pairing CSS before shipping.\n`)
  process.exit(1)
} else {
  console.log(`  ✅ All ${PAIRINGS.length} pairs pass WCAG AA\n`)
}
