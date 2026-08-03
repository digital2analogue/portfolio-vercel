import type { ComponentType } from "react";
import ReservationStatusDemo from "./ReservationStatusDemo";
import TableStatusDemo from "./TableStatusDemo";
import CheckUsageDemo from "./CheckUsageDemo";
import RuleCellDemo from "./RuleCellDemo";
import ReservationDetailDemo from "./ReservationDetailDemo";

/**
 * Registry of embeddable case-study demos, keyed by the string used in a
 * `{ type: "demo"; demo: "<key>" }` content block (see lib/caseContent.ts).
 * Adding a demo = add a component here + a key to the DemoKey union. The
 * closed union keeps caseContent.ts a pure data file and lets TypeScript
 * verify every referenced demo exists.
 */
export type DemoKey =
  | "reservation-status"
  | "table-status"
  | "check-usage"
  | "rule-cell"
  | "reservation-detail";

export const DEMO_REGISTRY: Record<DemoKey, ComponentType> = {
  "reservation-status": ReservationStatusDemo,
  "table-status": TableStatusDemo,
  "check-usage": CheckUsageDemo,
  "rule-cell": RuleCellDemo,
  "reservation-detail": ReservationDetailDemo,
};
