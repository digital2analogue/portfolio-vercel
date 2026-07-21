/**
 * checkUsageRules — a faithful client-side port of the static detectors behind
 * Parsimony's `check_usage` MCP tool (source of truth: the shared RULES in the
 * parsimony repo's scripts/rules.mjs, which also gate `validate` and the drift
 * scan). This powers the in-page playground on the /work/system case study.
 *
 * It covers the statically-detectable hard rules — hardcoded hex, primitive
 * token references, hardcoded font size/weight, and unapproved font families.
 * The deployed tool additionally checks deprecated tokens against the live
 * token registry; that check needs the registry and is out of scope here.
 *
 * Detectors run per line so violations carry a line:col the UI can show.
 */

export type Violation = {
  line: number; // 1-based
  col: number; // 1-based
  rule: string; // rule id
  message: string;
  snippet: string; // the offending text
};

// The only font families the system allows (case-insensitive). Generic
// keywords are always fine — they're not a specific typeface choice.
const APPROVED_FAMILIES = ["space grotesk", "spectral", "jetbrains mono", "geist"];
const GENERIC_FAMILIES = [
  "sans-serif",
  "serif",
  "monospace",
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "inherit",
  "initial",
  "unset",
  "revert",
];

function fontFamilyViolation(value: string): boolean {
  if (/var\(\s*--font-family/.test(value)) return false; // token-driven → ok
  const named = value
    .split(",")
    .map((f) => f.trim().replace(/['"]/g, "").toLowerCase())
    .filter(Boolean);
  // Flag if any named family is neither an approved typeface nor a generic keyword.
  return named.some(
    (f) => !APPROVED_FAMILIES.includes(f) && !GENERIC_FAMILIES.includes(f),
  );
}

function fontSizeViolation(value: string): boolean {
  if (/var\(/.test(value)) return false; // token → ok
  return /-?\d*\.?\d+\s*(px|rem|em|pt|vw|vh|%|ch)\b/.test(value);
}

function fontWeightViolation(value: string): boolean {
  if (/var\(/.test(value)) return false;
  return /\b(\d{2,3}|bold|bolder|lighter)\b/.test(value);
}

type Anywhere = { id: string; re: RegExp; message: (m: string) => string };

// Token-shaped detectors — valid anywhere on a line (CSS values, JSX inline
// styles, JS strings).
const ANYWHERE: Anywhere[] = [
  {
    id: "no-hex",
    re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g,
    message: (m) => `Hardcoded hex "${m}" — use a semantic var(--color-*) token, never a raw color.`,
  },
  {
    id: "no-primitive",
    re: /--primitive-[a-z0-9-]+/g,
    message: (m) => `Primitive token "${m}" — UI must reference the semantic layer, not primitives.`,
  },
];

// Declaration detectors — parse `prop: value` (CSS `font-size` or JSX
// `fontSize`) and judge the value.
const DECLS: { id: string; prop: RegExp; bad: (v: string) => boolean; message: string }[] = [
  {
    id: "font-size",
    prop: /font-?size/i,
    bad: fontSizeViolation,
    message: "Hardcoded font-size — use a --font-* token or a semantic font shorthand.",
  },
  {
    id: "font-weight",
    prop: /font-?weight/i,
    bad: fontWeightViolation,
    message: "Hardcoded font-weight — use a --font-weight-* token (display/title 300, body/label 400, strong 500).",
  },
  {
    id: "font-family",
    prop: /font-?family/i,
    bad: fontFamilyViolation,
    message: "Unapproved font-family — use var(--font-family-sans|serif|mono). Approved: Space Grotesk, Spectral, JetBrains Mono.",
  },
];

const DECL_RE = /([a-zA-Z-]+)\s*:\s*(['"]?)([^;{}\n]+?)\2\s*(?=;|$|\})/g;

export function lintSnippet(code: string): Violation[] {
  const out: Violation[] = [];
  const lines = code.split("\n");

  lines.forEach((line, i) => {
    // Skip whole-line comments so the "// fix:" hints in examples don't trip.
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;

    for (const d of ANYWHERE) {
      d.re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = d.re.exec(line))) {
        out.push({ line: i + 1, col: m.index + 1, rule: d.id, message: d.message(m[0]), snippet: m[0] });
        if (m.index === d.re.lastIndex) d.re.lastIndex += 1;
      }
    }

    DECL_RE.lastIndex = 0;
    let dm: RegExpExecArray | null;
    while ((dm = DECL_RE.exec(line))) {
      const prop = dm[1];
      const value = dm[3];
      for (const decl of DECLS) {
        if (decl.prop.test(prop) && decl.bad(value)) {
          out.push({
            line: i + 1,
            col: (dm.index ?? 0) + 1,
            rule: decl.id,
            message: decl.message,
            snippet: `${prop}: ${value}`.trim(),
          });
        }
      }
    }
  });

  return out.sort((a, b) => a.line - b.line || a.col - b.col);
}

/** The two preset snippets the playground loads. */
export const SAMPLE_VIOLATIONS = `.badge {
  color: #4ade6e;
  background: var(--primitive-color-green-500);
  font-size: 13px;
  font-weight: 700;
  font-family: Inter, sans-serif;
  padding: var(--spacing-tight);
}`;

export const SAMPLE_CLEAN = `.badge {
  color: var(--color-foreground-accent);
  background: var(--color-background-accent-green);
  font: var(--font-label-strong-small);
  padding: var(--spacing-tight);
}`;
