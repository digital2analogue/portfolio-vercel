import type { ComponentType } from "react";
import ReservationStatusDemo from "./ReservationStatusDemo";
import TableStatusDemo from "./TableStatusDemo";
import CheckUsageDemo from "./CheckUsageDemo";

/**
 * Registry of embeddable case-study demos, keyed by the string used in a
 * `{ type: "demo"; demo: "<key>" }` content block (see lib/caseContent.ts).
 * Adding a demo = add a component here + a key to the DemoKey union. The
 * closed union keeps caseContent.ts a pure data file and lets TypeScript
 * verify every referenced demo exists.
 */
export type DemoKey = "reservation-status" | "table-status" | "check-usage";

export const DEMO_REGISTRY: Record<DemoKey, ComponentType> = {
  "reservation-status": ReservationStatusDemo,
  "table-status": TableStatusDemo,
  "check-usage": CheckUsageDemo,
};
