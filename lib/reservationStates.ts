/**
 * Reservation-status states — the authoritative dataset behind the OTKit
 * "Table Statuses" interactive demo (components/demos/ReservationStatusDemo).
 *
 * Source of truth: the real `web-button/reservation-states` component in the
 * OpenTable "UI Kit — Rest Web 2026" Figma file (node 16879-259), read via the
 * Figma MCP. Each state's resting fill is the value resolved from the OTKit
 * Foundation VARIABLES library. In Figma, several states were still bound to
 * raw/CORE hexes rather than the semantic variable; every one of those hexes
 * resolves to an existing accent token, so here they are (re)bound to that
 * semantic token — the exact "map states onto the existing palette" move the
 * case study describes.
 *
 * Two fills are nudged from their exact Figma value to clear WCAG AA for their
 * white label (the source values sit just below 4.5:1). Marked `nudgedAA`.
 */

export type ReservationVariant = "solid" | "outline";

export type ReservationState = {
  id: string;
  label: string;
  /** Optional second line shown in the source component (e.g. "Reminder sent"). */
  sublabel?: string;
  /** Semantic OTKit token this fill maps to (the governance win). */
  token: string;
  /** Short token label for the semantic-lens legend. */
  tokenLabel: string;
  /** Resting fill (resolved hex from the VARIABLES library, AA-nudged where noted). */
  fill: string;
  /** Label/icon color on the fill. */
  on: string;
  /** solid = colored fill; outline = white surface with border (Finished, Cancelled). */
  variant: ReservationVariant;
  /** Icon key → inline SVG in the demo component. */
  icon: string;
  /** True when the resting fill was darkened from the exact Figma value to pass AA. */
  nudgedAA?: boolean;
  /** Arbitrary distinct hue used only by the "ad-hoc sprawl" lens. */
  sprawl: string;
};

// The linear service lifecycle — the path the demo's "Advance" affordance walks.
export const LIFECYCLE: ReservationState[] = [
  { id: "booked", label: "Booked", token: "background/action", tokenLabel: "action", fill: "#247f9e", on: "#ffffff", variant: "solid", icon: "menu", sprawl: "#3f7fd4" },
  { id: "booked-reminder", label: "Booked", sublabel: "Reminder sent", token: "background/action", tokenLabel: "action", fill: "#247f9e", on: "#ffffff", variant: "solid", icon: "menu", sprawl: "#4aa0c9" },
  { id: "confirmed", label: "Confirmed", token: "background/success", tokenLabel: "success", fill: "#2f864d", on: "#ffffff", variant: "solid", icon: "check", sprawl: "#3fae6a" },
  { id: "confirmed-sms", label: "Confirmed", sublabel: "SMS sent", token: "background/success", tokenLabel: "success", fill: "#2f864d", on: "#ffffff", variant: "solid", icon: "check", sprawl: "#67c98d" },
  { id: "running-late", label: "Running late", token: "background/warning", tokenLabel: "warning", fill: "#fdaf08", on: "#141a26", variant: "solid", icon: "clock", sprawl: "#f2c14e" },
  { id: "arrived", label: "Arrived", token: "background/accent-purple", tokenLabel: "accent-purple", fill: "#ad4cc3", on: "#ffffff", variant: "solid", icon: "arrived", sprawl: "#9b5de5" },
  { id: "partially-arrived", label: "Partially arrived", token: "background/accent-fuchsia", tokenLabel: "accent-fuchsia", fill: "#d82c82", on: "#ffffff", variant: "solid", icon: "partial-arrived", sprawl: "#e05299" },
  { id: "seated", label: "Seated", token: "background/accent-purple", tokenLabel: "accent-purple", fill: "#ad4cc3", on: "#ffffff", variant: "solid", icon: "seat", sprawl: "#7b4bd0" },
  { id: "partially-seated", label: "Partially seated", token: "background/accent-fuchsia", tokenLabel: "accent-fuchsia", fill: "#d82c82", on: "#ffffff", variant: "solid", icon: "partial-seated", sprawl: "#c74bb0" },
  { id: "appetizer", label: "Appetizer", token: "background/accent-violet", tokenLabel: "accent-violet", fill: "#7f5ce8", on: "#ffffff", variant: "solid", icon: "appetizer", sprawl: "#6d5ae0" },
  { id: "entree", label: "Entree", token: "background/accent-blue", tokenLabel: "accent-blue", fill: "#4a6fde", on: "#ffffff", variant: "solid", icon: "entree", sprawl: "#4f86e8" },
  { id: "dessert", label: "Dessert", token: "background/accent-teal", tokenLabel: "accent-teal", fill: "#20738f", on: "#ffffff", variant: "solid", icon: "dessert", nudgedAA: true, sprawl: "#37b0c9" },
  { id: "cleared", label: "Cleared", token: "background/accent-orange", tokenLabel: "accent-orange", fill: "#c84f29", on: "#ffffff", variant: "solid", icon: "cleared", sprawl: "#e0713f" },
  { id: "check-dropped", label: "Check dropped", token: "background/success", tokenLabel: "success", fill: "#2f864d", on: "#ffffff", variant: "solid", icon: "receipt", sprawl: "#2f9e8a" },
  { id: "bussing-needed", label: "Bussing needed", token: "background/warning", tokenLabel: "warning", fill: "#fdaf08", on: "#141a26", variant: "solid", icon: "bussing", sprawl: "#f2a93e" },
  { id: "paid", label: "Paid", token: "background/success", tokenLabel: "success", fill: "#2f864d", on: "#ffffff", variant: "solid", icon: "price", sprawl: "#4ab07a" },
  { id: "finished", label: "Finished", token: "background/default", tokenLabel: "default", fill: "#ffffff", on: "#2d333f", variant: "outline", icon: "check", sprawl: "#8b95a6" },
];

// Non-linear branch states reachable at any point (jump menu).
export const BRANCHES: ReservationState[] = [
  { id: "left-message", label: "Left message", token: "background/action", tokenLabel: "action", fill: "#247f9e", on: "#ffffff", variant: "solid", icon: "message", sprawl: "#5aa2d6" },
  { id: "confirmed-by-guest", label: "Confirmed", sublabel: "By guest", token: "background/success", tokenLabel: "success", fill: "#2f864d", on: "#ffffff", variant: "solid", icon: "check", sprawl: "#57c088" },
  { id: "guest-on-way", label: "Guest on their way", token: "background/success", tokenLabel: "success", fill: "#2f864d", on: "#ffffff", variant: "solid", icon: "nav", sprawl: "#43b39a" },
  { id: "cancelled", label: "Cancelled", token: "background/default", tokenLabel: "default", fill: "#ffffff", on: "#2d333f", variant: "outline", icon: "cancelled", sprawl: "#9aa3b2" },
  { id: "no-show", label: "No show", token: "background/danger", tokenLabel: "danger", fill: "#cc3b48", on: "#ffffff", variant: "solid", icon: "no-show", nudgedAA: true, sprawl: "#e0554f" },
];

export const ALL_STATES: ReservationState[] = [...LIFECYCLE, ...BRANCHES];

/**
 * The semantic palette the 22 states collapse onto — the "after" of the
 * before/after story. Ordered for the legend. Count = states mapped to it.
 */
export type SemanticToken = { token: string; label: string; fill: string; on: string; count: number };

export const SEMANTIC_PALETTE: SemanticToken[] = (() => {
  const order = [
    "background/action",
    "background/success",
    "background/warning",
    "background/danger",
    "background/accent-purple",
    "background/accent-fuchsia",
    "background/accent-violet",
    "background/accent-blue",
    "background/accent-teal",
    "background/accent-orange",
    "background/default",
  ];
  return order.map((token) => {
    const members = ALL_STATES.filter((s) => s.token === token);
    const first = members[0];
    return {
      token,
      label: first.tokenLabel,
      fill: first.fill,
      on: first.on,
      count: members.length,
    };
  });
})();

export const STATE_COUNT = ALL_STATES.length; // 22
export const TOKEN_COUNT = SEMANTIC_PALETTE.length; // 11
