// Thin JS re-exports of the CSS custom properties defined in app/globals.css.
// globals.css is the source of truth; these are only for inline-style use cases
// where a CSS class would be overkill (e.g. one-off dynamic styling).
//
// Prefer CSS classes for all new styling — the brand-tokens system lives in CSS,
// not here.

export const T = {
  // Canvas
  bg: "var(--color-background-default)",
  surface: "var(--color-background-alt)",
  border: "var(--color-border-default)",
  // Foreground
  fg: "var(--color-foreground-default)",
  fgAlt: "var(--color-foreground-alt)",
  fgMuted: "var(--color-foreground-muted)",
  // Interactive / accent
  accent: "var(--color-foreground-action)",
  onAccent: "var(--color-foreground-on-action)",
  bgAccent: "var(--color-background-accent)",
} as const;

// Font family primitives (for cases where the semantic shorthand isn't enough).
// Prefer the `--font-*` shorthand tokens in CSS whenever possible.
export const sans = "var(--primitive-font-family-sans)";
export const serif = "var(--primitive-font-family-serif)";
export const mono = "var(--primitive-font-family-mono)";

// Semantic typography shorthand tokens. Assign these to `font` in inline styles
// or use via `var(--font-*)` directly in CSS.
export const fontDisplay = "var(--font-display)";
export const fontTitleLarge = "var(--font-title-large)";
export const fontTitleMedium = "var(--font-title-medium)";
export const fontTitleSmall = "var(--font-title-small)";
export const fontBodyLarge = "var(--font-body-large)";
export const fontBodyMedium = "var(--font-body-medium)";
export const fontBodySmall = "var(--font-body-small)";
export const fontLabelLarge = "var(--font-label-large)";
export const fontLabelMedium = "var(--font-label-medium)";
export const fontLabelSmall = "var(--font-label-small)";
export const fontCode = "var(--font-code)";
