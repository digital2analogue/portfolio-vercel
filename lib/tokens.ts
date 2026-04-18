// Thin JS re-exports of the CSS custom properties defined in app/globals.css.
// Shape mirrors the prototype's `T` object so inline-style components port 1:1.
export const T = {
  bg: "var(--color-bg)",
  surface: "var(--color-surface)",
  surface2: "var(--color-surface-2)",
  border: "var(--color-border)",
  muted: "var(--color-muted)",
  secondary: "var(--color-secondary)",
  fg: "var(--color-fg)",
  accent: "var(--color-accent)",
} as const;

export const mono = "var(--font-mono)";
export const sans = "var(--font-sans)";
