/**
 * scripts/sync-tokens.mjs
 *
 * Compares the brand-tokens base build output (build/css/variables.css)
 * against the inlined token block in app/globals.css and reports any
 * drift in the --color-* namespace.
 *
 * Usage:
 *   npm run sync-tokens
 *
 * This script does NOT auto-overwrite. It shows you what's drifted so you
 * can decide whether to update brand-tokens or globals.css (or both).
 *
 * Exits 1 if drift is found, 0 if everything matches.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const BRAND_DIR  = path.join(__dirname, '../../brand-tokens')
const BRAND_CSS  = path.join(BRAND_DIR, 'build/css/variables.css')
const LOCAL_CSS  = path.join(__dirname, '../app/globals.css')

// ─── Build brand-tokens ────────────────────────────────────────────────────────

console.log('\n  Building brand-tokens...\n')
try {
  execSync('node scripts/build-brands.mjs', { cwd: BRAND_DIR, stdio: 'inherit' })
} catch {
  console.error('\n  ❌ brand-tokens build failed — fix errors above first.\n')
  process.exit(1)
}

// ─── Parse + resolve ───────────────────────────────────────────────────────────

function parseTokens(css) {
  const tokens = {}
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const re = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(stripped)) !== null) {
    tokens[`--${m[1]}`] = m[2].trim()
  }
  return tokens
}

function resolveVar(value, tokens, depth = 0) {
  if (depth > 20) return value
  return value.replace(/var\(--([a-zA-Z0-9-]+)(?:[^)]*)\)/g, (_, name) => {
    const ref = `--${name}`
    return tokens[ref] ? resolveVar(tokens[ref], tokens, depth + 1) : value
  })
}

function fullyResolve(tokens) {
  const out = {}
  for (const [k, raw] of Object.entries(tokens)) {
    const v = resolveVar(raw, tokens)
    out[k] = v.toLowerCase()
  }
  return out
}

const brandRaw  = parseTokens(fs.readFileSync(BRAND_CSS, 'utf8'))
const localRaw  = parseTokens(fs.readFileSync(LOCAL_CSS, 'utf8'))

const brandFull = fullyResolve({ ...brandRaw })
const localFull = fullyResolve({ ...localRaw })

// Only compare --color-* semantic tokens
const brandColors = Object.fromEntries(Object.entries(brandFull).filter(([k]) => k.match(/^--color-/)))
const localColors = Object.fromEntries(Object.entries(localFull).filter(([k]) => k.match(/^--color-/)))

const allKeys = new Set([...Object.keys(brandColors), ...Object.keys(localColors)])

const drifted      = []
const missingLocal = []
const localOnly    = []

for (const key of [...allKeys].sort()) {
  const inBrand = key in brandColors
  const inLocal = key in localColors

  if (inBrand && inLocal) {
    if (brandColors[key] !== localColors[key]) {
      drifted.push({ key, brand: brandColors[key], local: localColors[key] })
    }
  } else if (inBrand) {
    missingLocal.push({ key, value: brandColors[key] })
  } else {
    localOnly.push({ key, value: localColors[key] })
  }
}

// ─── Report ────────────────────────────────────────────────────────────────────

console.log('\n  Token sync report\n')

if (drifted.length === 0 && missingLocal.length === 0 && localOnly.length === 0) {
  console.log('  ✅ Perfect sync — globals.css matches brand-tokens exactly.\n')
  process.exit(0)
}

if (drifted.length) {
  console.log(`  ⚠️  ${drifted.length} token(s) have drifted between brand-tokens and globals.css:\n`)
  for (const { key, brand, local } of drifted) {
    console.log(`    ${key}`)
    console.log(`      brand-tokens → ${brand}`)
    console.log(`      globals.css  → ${local}`)
    console.log()
  }
  console.log('  Action: update brand-tokens (if globals.css is correct) or vice versa.\n')
}

if (missingLocal.length) {
  console.log(`  ℹ️  ${missingLocal.length} token(s) exist in brand-tokens but not in globals.css:\n`)
  for (const { key, value } of missingLocal) {
    console.log(`    ${key}: ${value}`)
  }
  console.log()
}

if (localOnly.length) {
  console.log(`  ℹ️  ${localOnly.length} local-only token(s) in globals.css not yet in brand-tokens:\n`)
  for (const { key, value } of localOnly) {
    console.log(`    ${key}: ${value}`)
  }
  console.log('  Action: move these into brand-tokens when stable.\n')
}

if (drifted.length > 0) {
  process.exit(1)
}
