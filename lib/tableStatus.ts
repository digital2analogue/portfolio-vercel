/**
 * Table-status tiles — the dataset behind the OTKit floor-plan contrast-audit
 * demo (components/demos/TableStatusDemo).
 *
 * Source of truth: the real `.iOS-tile-reservation/parts/table status` component
 * set in the OpenTable "UI Kit — Rest Web 2026" Figma file (node 15832:1266),
 * read via the Figma MCP. Each tile is a 48×56 square showing a table number
 * (SF Pro 16) + a course/status icon, filled by a semantic OTKit token.
 *
 * The audit models the token system faithfully: each tile's label uses its
 * background's own `foreground/on-<token>` color — which is what the component
 * renders in "designed" (Before). Two backgrounds bind that on-token to WHITE
 * where it fails WCAG AA:
 *   • the drinks tiles (accent-lime #ABC31B, on-accent-lime = white, 1.99:1)
 *   • course 4 (accent-teal #2B9ABF, on-accent-teal = white, 3.24:1)
 * The repair:
 *   • drinks → fall back to `foreground-default` #2D333F (6.37:1) — the on-token
 *     was the wrong pairing, not the fill.
 *   • course 4 → the foreground-default fallback only reaches 3.91:1, so the FILL
 *     is darkened to accent-teal #20738F instead, keeping the white on-token
 *     (5.37:1) — the same nudge used for Dessert in the reservation demo.
 * Every other tile already uses its correct on-token (secondaries + lemon =
 * #141A26, primaries = a white that already passes) and is unchanged.
 */

const FG_DEFAULT = "#2d333f"; // foreground/default
const INK = "#141a26"; // foreground/on-*-secondary + on-accent-lemon/-yellow
const WHITE = "#ffffff";

export type TileVariant = { fill: string; on: string; onToken: string };
export type Tile = {
  id: string;
  label: string;
  /** Semantic OTKit background token. */
  fillToken: string;
  /** Icon key → inline SVG in the demo component. */
  icon: string;
  /** Label color as the component ships today (its background's on-token). */
  designed: TileVariant;
  /** Label color after the AA repair (equal to `designed` when it already passed). */
  repaired: TileVariant;
};

// A tile whose designed on-token already passes AA → designed === repaired.
const ok = (fill: string, fillToken: string, on: string, onToken: string): Pick<Tile, "fillToken" | "designed" | "repaired"> => ({
  fillToken,
  designed: { fill, on, onToken },
  repaired: { fill, on, onToken },
});

export const TILES: Tile[] = [
  { id: "seated",           label: "Seated",           icon: "seated",  ...ok("#ad4cc3", "accent-purple",           WHITE, "on-accent-purple") },
  { id: "partially-seated", label: "Partially seated", icon: "partial", ...ok("#d82c82", "accent-fuchsia",          WHITE, "on-accent-fuchsia") },
  { id: "appetizer",        label: "Appetizer",        icon: "appetizer", ...ok("#d5c9f7", "accent-violet-secondary", INK, "on-accent-violet-secondary") },
  { id: "entree",           label: "Entree",           icon: "entree",  ...ok("#4a6fde", "accent-blue",             WHITE, "on-accent-blue") },
  { id: "dessert",          label: "Dessert",          icon: "dessert", ...ok("#61bddb", "accent-teal-secondary",    INK, "on-accent-teal-secondary") },
  { id: "cleared",          label: "Cleared",          icon: "cleared", ...ok("#c84f29", "accent-orange",           WHITE, "on-accent-orange") },
  { id: "check-dropped",    label: "Check dropped",    icon: "receipt", ...ok("#2f864d", "success",                 WHITE, "on-success") },
  { id: "paid",             label: "Paid",             icon: "price",   ...ok("#64c987", "accent-green-secondary",   INK, "on-accent-green-secondary") },
  { id: "needs-bussing",    label: "Needs bussing",    icon: "bussing", ...ok("#fdaf08", "warning",                  INK, "on-accent-yellow") },
  { id: "course-1",         label: "Course 1",         icon: "c1",      ...ok("#ddeb8a", "accent-lime-secondary",    INK, "on-accent-lime-secondary") },
  { id: "course-2",         label: "Course 2",         icon: "c2",      ...ok("#eb93bf", "accent-fuchsia-secondary", INK, "on-accent-fuchsia-secondary") },
  { id: "course-3",         label: "Course 3",         icon: "c3",      ...ok("#7f5ce8", "accent-violet",           WHITE, "on-accent-violet") },
  // ── AA failure #1: accent-teal bound to white (3.24:1) → darken the fill ──
  {
    id: "course-4", label: "Course 4", icon: "c4", fillToken: "accent-teal",
    designed: { fill: "#2b9abf", on: WHITE, onToken: "on-accent-teal" },
    repaired: { fill: "#20738f", on: WHITE, onToken: "on-accent-teal (fill darkened)" },
  },
  { id: "course-5",         label: "Course 5",         icon: "c5",      ...ok("#b1c1f1", "accent-blue-secondary",    INK, "on-accent-blue-secondary") },
  { id: "course-6",         label: "Course 6",         icon: "c6",      ...ok("#e69b84", "accent-orange-secondary",  INK, "on-accent-orange-secondary") },
  { id: "palette-cleanser", label: "Palate cleanser",  icon: "sorbet",  ...ok("#3ddbb6", "accent-aqua-secondary",    INK, "on-accent-aqua-secondary") },
  // ── AA failure #2: accent-lime bound to white (1.99:1) → foreground-default ──
  ...["drinks", "post-meal-drinks", "bottle-service"].map((id, i) => ({
    id,
    label: ["Drinks", "Post-meal drinks", "Bottle service"][i],
    icon: ["drinks", "cocktail", "bottle"][i],
    fillToken: "accent-lime",
    designed: { fill: "#abc31b", on: WHITE, onToken: "on-accent-lime" },
    repaired: { fill: "#abc31b", on: FG_DEFAULT, onToken: "foreground-default" },
  })),
  { id: "tasting",          label: "Tasting",          icon: "chef",    ...ok("#f1f2f4", "background-alt",           FG_DEFAULT, "foreground-default") },
  { id: "table-knock",      label: "Table knock",      icon: "flag",    ...ok("#ffe922", "accent-lemon",             INK, "on-accent-lemon") },
];

// ── WCAG contrast (same math as scripts/check-contrast.mjs) ──
function linearize(c: number) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}
export function contrastRatio(a: string, b: string) {
  const la = luminance(a), lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type AuditMode = "designed" | "repaired";
export const variantFor = (t: Tile, mode: AuditMode): TileVariant => (mode === "designed" ? t.designed : t.repaired);
export const ratioFor = (t: Tile, mode: AuditMode) => contrastRatio(variantFor(t, mode).on, variantFor(t, mode).fill);
export const passesAA = (t: Tile, mode: AuditMode) => ratioFor(t, mode) >= 4.5;

export const TILE_COUNT = TILES.length;
export const failingIds = TILES.filter((t) => !passesAA(t, "designed")).map((t) => t.id);
