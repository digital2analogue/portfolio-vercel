/**
 * Table-status tiles — the dataset behind the OTKit floor-plan contrast-audit
 * demo (components/demos/TableStatusDemo).
 *
 * Source of truth: the real `.iOS-tile-reservation/parts/table status` component
 * set in the OpenTable "UI Kit — Rest Web 2026" Figma file (node 15832:1266),
 * read via the Figma MCP. Each tile is a 48×56 square showing a table number
 * (SF Pro 16) + a course/status icon, filled by a semantic OTKit token.
 *
 * The audit: every *light-tint* tile correctly pairs its label with ink
 * (#141A26) and clears WCAG AA comfortably. But four tiles were bound to fills
 * too light for a WHITE label — course 4 (teal #2B9ABF, 3.24:1) and the three
 * drinks tiles (lime #ABC31B, 1.99:1, failing even the 3:1 non-text bar). The
 * fix follows the token system's own rule (`on-*-secondary = #141A26`): bind
 * those fills to ink. See `repairedOn`.
 */

export type Tile = {
  id: string;
  label: string;
  /** Semantic OTKit token this fill maps to. */
  token: string;
  fill: string;
  /** Icon key → inline SVG in the demo component. */
  icon: string;
  /** Label/icon color as the component ships today. */
  designedOn: string;
  /** Label/icon color after the AA repair (same as designedOn when it already passed). */
  repairedOn: string;
};

// The colored status tiles (number + icon), in service order. Structural tiles
// (empty / unassigned / overbooking outlines) are omitted — the story is color.
export const TILES: Tile[] = [
  { id: "seated",           label: "Seated",           token: "accent-purple",           fill: "#ad4cc3", icon: "seat",    designedOn: "#ffffff", repairedOn: "#ffffff" },
  { id: "partially-seated", label: "Partially seated", token: "accent-fuchsia",          fill: "#d82c82", icon: "partial", designedOn: "#ffffff", repairedOn: "#ffffff" },
  { id: "appetizer",        label: "Appetizer",        token: "accent-violet-secondary", fill: "#d5c9f7", icon: "plate",   designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "entree",           label: "Entree",           token: "accent-blue",             fill: "#4a6fde", icon: "plate",   designedOn: "#ffffff", repairedOn: "#ffffff" },
  { id: "dessert",          label: "Dessert",          token: "accent-teal-secondary",   fill: "#61bddb", icon: "dessert", designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "cleared",          label: "Cleared",          token: "accent-orange",           fill: "#c84f29", icon: "clear",   designedOn: "#ffffff", repairedOn: "#ffffff" },
  { id: "check-dropped",    label: "Check dropped",    token: "success",                 fill: "#2f864d", icon: "receipt", designedOn: "#ffffff", repairedOn: "#ffffff" },
  { id: "paid",             label: "Paid",             token: "accent-green-secondary",  fill: "#64c987", icon: "price",   designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "needs-bussing",    label: "Needs bussing",    token: "warning",                 fill: "#fdaf08", icon: "broom",   designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "course-1",         label: "Course 1",         token: "accent-lime-secondary",   fill: "#ddeb8a", icon: "c1",      designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "course-2",         label: "Course 2",         token: "accent-fuchsia-secondary",fill: "#eb93bf", icon: "c2",      designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "course-3",         label: "Course 3",         token: "accent-violet",           fill: "#7f5ce8", icon: "c3",      designedOn: "#ffffff", repairedOn: "#ffffff" },
  // ── AA failures (bound to a fill too light for white) → repaired to ink ──
  { id: "course-4",         label: "Course 4",         token: "accent-teal",             fill: "#2b9abf", icon: "c4",      designedOn: "#ffffff", repairedOn: "#141a26" },
  { id: "course-5",         label: "Course 5",         token: "accent-blue-secondary",   fill: "#b1c1f1", icon: "c5",      designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "course-6",         label: "Course 6",         token: "accent-orange-secondary", fill: "#e69b84", icon: "c6",      designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "palette-cleanser", label: "Palate cleanser",  token: "accent-aqua-secondary",   fill: "#3ddbb6", icon: "dessert",designedOn: "#141a26", repairedOn: "#141a26" },
  { id: "drinks",           label: "Drinks",           token: "accent-lime",             fill: "#abc31b", icon: "wine",    designedOn: "#ffffff", repairedOn: "#141a26" },
  { id: "post-meal-drinks", label: "Post-meal drinks", token: "accent-lime",             fill: "#abc31b", icon: "cocktail",designedOn: "#ffffff", repairedOn: "#141a26" },
  { id: "bottle-service",   label: "Bottle service",   token: "accent-lime",             fill: "#abc31b", icon: "bottle",  designedOn: "#ffffff", repairedOn: "#141a26" },
  { id: "tasting",          label: "Tasting",          token: "background-alt",          fill: "#f1f2f4", icon: "chef",    designedOn: "#2d333f", repairedOn: "#2d333f" },
  { id: "table-knock",      label: "Table knock",      token: "accent-lemon",            fill: "#ffe922", icon: "flag",    designedOn: "#141a26", repairedOn: "#141a26" },
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
export const onColor = (t: Tile, mode: AuditMode) => (mode === "designed" ? t.designedOn : t.repairedOn);
export const ratioFor = (t: Tile, mode: AuditMode) => contrastRatio(onColor(t, mode), t.fill);
export const passesAA = (t: Tile, mode: AuditMode) => ratioFor(t, mode) >= 4.5;

export const TILE_COUNT = TILES.length;
export const failingIds = TILES.filter((t) => !passesAA(t, "designed")).map((t) => t.id);
