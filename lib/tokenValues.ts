// Build-time resolver for the published design-system tokens.
//
// Reads the installed @digital2analogue2/tokens base CSS and resolves a token
// name to its concrete value, following var() references. The /tokens viewer
// uses this so its swatches and values are always what the package actually
// ships — never a hand-typed copy that can drift from the source of truth.
//
// Server-only: reads from node_modules at build time. Do not import from a
// client component.

import fs from "node:fs";
import path from "node:path";

const CSS_PATH = path.join(
  process.cwd(),
  "node_modules/@digital2analogue2/tokens/css/variables.css",
);

/** The installed package version — shown in the /tokens hero so it can't drift. */
export const tokenVersion: string = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "node_modules/@digital2analogue2/tokens/package.json"),
    "utf8",
  ),
).version;

const RAW: Record<string, string> = {};
for (const m of fs
  .readFileSync(CSS_PATH, "utf8")
  .matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
  RAW[m[1]] = m[2].trim();
}

/**
 * Resolve a CSS custom property to its concrete value, following var() chains.
 *
 * Throws if the token is absent — so if a token is renamed or removed upstream,
 * the /tokens page fails the build loudly instead of rendering a blank or stale
 * value. The catalog is a self-checking artifact.
 */
export function tokenValue(name: string): string {
  if (!(name in RAW)) {
    throw new Error(
      `tokenValue: ${name} not found in @digital2analogue2/tokens. ` +
        `It may have been renamed or removed — update the /tokens catalog or bump the package.`,
    );
  }
  let v = RAW[name];
  for (let i = 0; v.includes("var(") && i < 20; i++) {
    v = v.replace(/var\((--[a-zA-Z0-9-]+)(?:,[^)]*)?\)/g, (_, ref) => RAW[ref] ?? "");
  }
  v = v.trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(v) ? v.toUpperCase() : v;
}
