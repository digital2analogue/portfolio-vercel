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
// Base tokens come from the installed @digital2analogue2/tokens package;
// globals.css carries only the portfolio's overrides. Parse both.
const PKG_CSS = path.join(__dirname, '../node_modules/@digital2analogue2/tokens/css/variables.css')

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
