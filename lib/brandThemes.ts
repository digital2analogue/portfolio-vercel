/**
 * OTKit brand collections — the dataset behind the "One component, two brands"
 * demo (components/demos/BrandThemeDemo).
 *
 * Source of truth: the brand-collection table in River's 2026 portfolio deck
 * (VSCO, Aug 2026, slide 13), read from the PDF's *declared vector fill values*
 * rather than eyedropped from a render — the same "pull the tokens, don't
 * sample the pixels" rule the iPad demo learned the hard way.
 *
 * Two independent cross-checks that these are the real OTKit values:
 *   • `--otk-action` in globals.css is already #247F9E — Restaurant brand/default.
 *   • #2B9ABF (Restaurant brand/hover) is accent-teal in lib/tableStatus.ts, and
 *     #141A26 (Iconic brand/pressed) is OTKit's documented dark background/default.
 *
 * TWO TIERS, and the distinction is the whole point. `brand/*` below is the
 * brand-collection tier — the thing that re-points. Components never reference
 * it. A button asks for the semantic token and the collection decides what it
 * resolves to:
 *
 *   otkit/background-action          → brand/default
 *   otkit/background-action-hover    → brand/hover
 *   otkit/background-action-pressed  → brand/pressed
 *   otkit/foreground-on-action       → shared, never re-points
 *
 * Evidence rather than assumption for the resting step: OTKit's own prototype
 * ships `background-action` = #247F9E, exactly Restaurant's brand/default, and
 * `foreground-on-action` = #FFFFFF shared across all three collections.
 *
 * Everything is prefixed `otkit/` (and `--otkit-*` in CSS) to hold OTKit's
 * namespace apart from Parsimony's `--color-*`. Not cosmetic: declaring
 * `--color-background-action` inside this demo — even scoped to a class — made
 * the contrast gate's flat parser read it as a global override and silently
 * drop a real pairing.
 *
 * The refresh was a re-binding, not a redraw.
 */

export type BrandId = "diner" | "restaurant" | "iconic";

export type Brand = {
  id: BrandId;
  label: string;
  /** Resting fill for the primary action. */
  default: string;
  /** Hover fill. */
  hover: string;
  /** Pressed fill. */
  pressed: string;
  /** Tinted page surface the card sits on. */
  altLight: string;
};

/** The four variables that re-point per brand. */
export const BRAND_TOKENS = [
  { key: "default", token: "brand/default" },
  { key: "hover", token: "brand/hover" },
  { key: "pressed", token: "brand/pressed" },
  { key: "altLight", token: "brand/alt-light" },
] as const satisfies ReadonlyArray<{ key: keyof Brand; token: string }>;

export const BRANDS: Brand[] = [
  {
    id: "diner",
    label: "Diner",
    default: "#DA3743",
    hover: "#E15B64",
    pressed: "#931B23",
    altLight: "#FCEEEF",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    default: "#247F9E",
    hover: "#2B9ABF",
    pressed: "#154A5B",
    altLight: "#EEF8FB",
  },
  {
    id: "iconic",
    label: "Iconic",
    default: "#2D333F",
    hover: "#575C66",
    pressed: "#141A26",
    altLight: "#F2EFE6",
  },
];

/**
 * Tokens shared across every brand — unchanged by the refresh.
 *
 * `alt` is OTKit's base `--color-foreground-alt`, taken from the deck's own
 * iPad prototype page (bundled inside the published artifact). Slide 13's
 * readout row labels foreground/alt as #575C66, but that row shows values
 * with ICONIC already applied and #575C66 is exactly Iconic's brand/hover —
 * so it is a resolved value, not the shared one. Using it here would have
 * quietly contradicted the demo's own point about what re-points.
 */
export const SHARED = {
  bg: "#FFFFFF",
  ink: "#141A26",
  alt: "#4A4F59",
  border: "#D8D9DB",
  /**
   * `foreground/on-action` — the button label. Shared, never re-pointed, which
   * is why one white works across all three collections and why the audit below
   * is a single pairing rather than three. Same value as `bg` here, but a
   * different token doing a different job; don't collapse them.
   */
  onAction: "#FFFFFF",
};

/**
 * Six variables re-point per brand; 278 are shared (deck slide 13).
 * BRAND_TOKENS above is the four-step action ramp the deck's table shows by
 * name — the remaining two of the six are not broken out there, so they are
 * counted but not enumerated.
 */
export const REPOINTED = 6;
export const SHARED_VARIABLES = 278;
export const TOTAL_VARIABLES = REPOINTED + SHARED_VARIABLES;

/** The restaurant record the card renders, identical across all three brands. */
export const RECORD = {
  badge: "Two MICHELIN Stars",
  name: "Lazy Bear",
  meta: "American · Mission, San Francisco · $$$$",
  times: ["6:45", "7:30", "8:15"],
  selectedTime: "7:30",
};

const channel = (h: string) => {
  const v = parseInt(h, 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const luminance = (hex: string) => {
  const h = hex.replace("#", "");
  return (
    0.2126 * channel(h.slice(0, 2)) +
    0.7152 * channel(h.slice(2, 4)) +
    0.0722 * channel(h.slice(4, 6))
  );
};

/** WCAG relative-contrast ratio between two hex colors. */
export const ratio = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export const AA_TEXT = 4.5;

/**
 * `foreground/on-action` measured against each step of a brand's action ramp.
 * This is the audit the deck's "every black-button state clears AA, not just
 * default" claim rests on — and it is the legacy brands, not Iconic, that fail
 * it.
 */
export const ACTION_RAMP = [
  { state: "default", token: "background-action" },
  { state: "hover", token: "background-action-hover" },
  { state: "pressed", token: "background-action-pressed" },
] as const satisfies ReadonlyArray<{ state: keyof Brand; token: string }>;

export const stateAudit = (brand: Brand) =>
  ACTION_RAMP.map(({ state, token }) => {
    const fill = brand[state] as string;
    const r = ratio(SHARED.onAction, fill);
    return { state, token, fill, ratio: r, passes: r >= AA_TEXT };
  });

/** True when every state of the ramp clears AA for its white label. */
export const clearsEveryState = (brand: Brand) =>
  stateAudit(brand).every((s) => s.passes);
