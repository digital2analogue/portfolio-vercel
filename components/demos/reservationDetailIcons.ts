/**
 * Supplementary glyphs for the reservation-detail demo.
 *
 * PROVENANCE — these are NOT from the OTKit export. `otkitIcons.ts` holds real
 * OTKit vectors (status/course glyphs) and stays the source of truth for
 * anything the export covers; the reservation-detail screen also uses generic
 * chrome icons (chevrons, overflow, avatar, edit, tag, star, cutlery, history,
 * plus) that the exported set doesn't include. Those are hand-authored here to
 * match the source screen's weight and 24px grid. If the OTKit export ever
 * gains them, delete the entry here and reference OTKIT_ICONS instead.
 *
 * Two rendering modes, because the source screen mixes them: solid glyphs are
 * filled paths like the OTKit set; ring-based glyphs (history) are stroked,
 * which is how they read on the device at 20px.
 */

import { OTKIT_ICONS, type OtkitIcon } from "./otkitIcons";

export type DemoIcon = OtkitIcon & {
  /** Render as 2px strokes with no fill, rather than filled paths. */
  stroke?: boolean;
};

const EXTRA_ICONS: Record<string, DemoIcon> = {
  "chevron-left": {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L9.41421 12L14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289Z",
      },
    ],
  },
  "chevron-right": {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289Z",
      },
    ],
  },
  "overflow": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 4C12.8284 4 13.5 4.67157 13.5 5.5C13.5 6.32843 12.8284 7 12 7C11.1716 7 10.5 6.32843 10.5 5.5C10.5 4.67157 11.1716 4 12 4Z" },
      { d: "M12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5Z" },
      { d: "M12 17C12.8284 17 13.5 17.6716 13.5 18.5C13.5 19.3284 12.8284 20 12 20C11.1716 20 10.5 19.3284 10.5 18.5C10.5 17.6716 11.1716 17 12 17Z" },
    ],
  },
  "person": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 4C13.933 4 15.5 5.567 15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4Z" },
      { d: "M12 13C16.0796 13 19.4131 15.6033 19.9451 18.9716C20.0313 19.5172 19.5523 20 19 20H5C4.44772 20 3.96874 19.5172 4.05489 18.9716C4.58694 15.6033 7.92038 13 12 13Z" },
    ],
  },
  "edit": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M17.2929 3.29289C18.0739 2.51184 19.3403 2.51184 20.1213 3.29289L20.7071 3.87868C21.4882 4.65973 21.4882 5.92606 20.7071 6.70711L19.1213 8.29289L15.7071 4.87868L17.2929 3.29289Z" },
      { d: "M14.2929 6.29289L17.7071 9.70711L9.53553 17.8787C9.40469 18.0095 9.24012 18.1019 9.06 18.1459L5.24264 19.0784C4.55379 19.2467 3.93198 18.6249 4.10025 17.936L5.03284 14.1187C5.07681 13.9386 5.16921 13.774 5.30005 13.6432L14.2929 6.29289Z" },
    ],
  },
  "tag": {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M3 5C3 3.89543 3.89543 3 5 3H10.1716C10.702 3 11.2107 3.21071 11.5858 3.58579L20.4142 12.4142C21.1953 13.1953 21.1953 14.4616 20.4142 15.2426L15.2426 20.4142C14.4616 21.1953 13.1953 21.1953 12.4142 20.4142L3.58579 11.5858C3.21071 11.2107 3 10.702 3 10.1716V5ZM7.5 6C6.67157 6 6 6.67157 6 7.5C6 8.32843 6.67157 9 7.5 9C8.32843 9 9 8.32843 9 7.5C9 6.67157 8.32843 6 7.5 6Z",
        fillRule: "evenodd",
        clipRule: "evenodd",
      },
    ],
  },
  "star": {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M12 2.5C12.3831 2.5 12.7329 2.71607 12.9041 3.05836L15.3475 7.94369L20.7773 8.73755C21.1577 8.79317 21.4736 9.05993 21.5921 9.42589C21.7106 9.79185 21.611 10.1934 21.3352 10.4617L17.4055 14.2851L18.3331 19.7332C18.3981 20.1147 18.2409 20.5001 17.9278 20.7275C17.6147 20.955 17.1998 20.985 16.8575 20.805L12 18.2534L7.14245 20.805C6.80017 20.985 6.38526 20.955 6.07216 20.7275C5.75906 20.5001 5.60189 20.1147 5.66684 19.7332L6.59446 14.2851L2.66477 10.4617C2.38896 10.1934 2.28937 9.79185 2.40787 9.42589C2.52637 9.05993 2.84226 8.79317 3.22268 8.73755L8.65249 7.94369L11.0959 3.05836C11.2671 2.71607 11.6169 2.5 12 2.5Z",
      },
    ],
  },
  "utensils": {
    viewBox: "0 0 24 24",
    stroke: true,
    paths: [
      { d: "M4 2.5V8.5C4 9.60457 4.89543 10.5 6 10.5H7C8.10457 10.5 9 9.60457 9 8.5V2.5" },
      { d: "M6.5 2.5V21.5" },
      { d: "M20 15.5V2.5C17.5 2.5 15.5 4.5 15.5 8.5V13.5C15.5 14.6046 16.3954 15.5 17.5 15.5H20ZM20 15.5V21.5" },
    ],
  },
  "history": {
    viewBox: "0 0 24 24",
    stroke: true,
    paths: [
      { d: "M3.5 11.5A8.5 8.5 0 1 1 5.7 18" },
      { d: "M3 5.5V11.5H9" },
      { d: "M12 7.5V12L15.25 14" },
    ],
  },
  // Flagged guestbook notes (allergy, comp instruction) — the one place this
  // screen raises its voice, so the glyph is a solid triangle, not an outline.
  "alert": {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M10.6314 3.09482C11.2413 2.02673 12.7587 2.02673 13.3686 3.09482L21.8006 17.8564C22.4062 18.9166 21.6405 20.2353 20.4319 20.2353H3.5681C2.35953 20.2353 1.59378 18.9166 2.19937 17.8564L10.6314 3.09482ZM12 8C11.4477 8 11 8.44772 11 9V13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V9C13 8.44772 12.5523 8 12 8ZM12 15.25C11.4477 15.25 11 15.6977 11 16.25C11 16.8023 11.4477 17.25 12 17.25C12.5523 17.25 13 16.8023 13 16.25C13 15.6977 12.5523 15.25 12 15.25Z",
        fillRule: "evenodd",
        clipRule: "evenodd",
      },
    ],
  },
  "plus": {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z",
      },
    ],
  },
};

/**
 * Every glyph the reservation-detail demo can name. OTKit vectors win on key
 * collision — the export is authoritative wherever it reaches.
 */
export const RESERVATION_DETAIL_ICONS: Record<string, DemoIcon> = {
  ...EXTRA_ICONS,
  ...OTKIT_ICONS,
};
