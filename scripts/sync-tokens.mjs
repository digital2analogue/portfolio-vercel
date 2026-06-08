/**
 * scripts/sync-tokens.mjs
 *
 * Since the portfolio migrated off its inlined token block and now consumes
 * @digital2analogue2/tokens (see app/globals.css), this no longer diffs a copied
 * block. Instead it checks that the INSTALLED package version matches the latest
 * published on npm — i.e. that this consumer hasn't drifted behind the source of
 * truth.
 *
 * Usage:
 *   npm run sync-tokens
 *
 * Exits 1 if the installed version is behind the published latest, 0 if current.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG = '@digital2analogue2/tokens'
const INSTALLED_PKG_JSON = path.join(__dirname, `../node_modules/${PKG}/package.json`)

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`)
  process.exit(1)
}

if (!fs.existsSync(INSTALLED_PKG_JSON)) {
  fail(`${PKG} is not installed. Run: npm install ${PKG}`)
}

const installed = JSON.parse(fs.readFileSync(INSTALLED_PKG_JSON, 'utf8')).version

let latest
try {
  latest = execSync(`npm view ${PKG} version`, { encoding: 'utf8' }).trim()
} catch {
  console.log(`\n  ⚠ Could not reach npm to check the latest ${PKG} version.`)
  console.log(`     Installed: ${installed}. Skipping the freshness check.\n`)
  process.exit(0)
}

console.log(`\n  ${PKG}`)
console.log(`    installed: ${installed}`)
console.log(`    published: ${latest}`)

if (installed === latest) {
  console.log(`\n  ✓ Up to date with the published source of truth.\n`)
  process.exit(0)
} else {
  console.error(`\n  ✗ Behind the published tokens. Run: npm install ${PKG}@${latest}\n`)
  process.exit(1)
}
