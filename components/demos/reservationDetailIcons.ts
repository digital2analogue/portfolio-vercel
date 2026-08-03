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
 */

import { OTKIT_ICONS, type OtkitIcon } from "./otkitIcons";

/**
 * Every glyph is a FILLED silhouette — no stroked variants. The OTKit export is
 * filled, so those vectors are authoritative; a stroked supplementary glyph next
 * to them reads as a different icon set on the same row. There used to be a
 * `stroke` mode here for two glyphs (utensils, history) and it is deliberately
 * gone rather than merely unused, so the mixed set cannot return by accident.
 */
export type DemoIcon = OtkitIcon;

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
  /** App-drawer affordance in the tablet service bar. OTKit's `menu` is the
   *  RESTAURANT menu (a bound book) and was standing in here, which read as
   *  "open the menu" in entirely the wrong sense. Three bars, same 24px grid. */
  "hamburger": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M3 6.75C3 6.33579 3.33579 6 3.75 6H20.25C20.6642 6 21 6.33579 21 6.75C21 7.16421 20.6642 7.5 20.25 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75Z" },
      { d: "M3 12C3 11.5858 3.33579 11.25 3.75 11.25H20.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75H3.75C3.33579 12.75 3 12.4142 3 12Z" },
      { d: "M3 17.25C3 16.8358 3.33579 16.5 3.75 16.5H20.25C20.6642 16.5 21 16.8358 21 17.25C21 17.6642 20.6642 18 20.25 18H3.75C3.33579 18 3 17.6642 3 17.25Z" },
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
  // Deliberately a LIGHT silhouette. The earlier pencil was a fat diagonal band
  // (~2.4 units across) which read as heavy next to 14px text; this is ~1.8.
  "edit": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M17.85 3.95C18.45 3.35 19.42 3.35 20.02 3.95L20.35 4.28C20.95 4.88 20.95 5.85 20.35 6.45L19.15 7.65L16.65 5.15L17.85 3.95Z" },
      { d: "M15.55 6.25L18.05 8.75L9.86 16.94C9.76 17.04 9.63 17.11 9.49 17.14L6.16 17.93C5.63 18.06 5.15 17.58 5.28 17.05L6.07 13.72C6.1 13.58 6.17 13.45 6.27 13.35L15.55 6.25Z" },
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
  // Fork (three tines + body) and knife, as solid silhouettes.
  "utensils": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M3.7 3C4.09 3 4.4 3.31 4.4 3.7V10H3V3.7C3 3.31 3.31 3 3.7 3Z" },
      { d: "M6.25 3C6.64 3 6.95 3.31 6.95 3.7V10H5.55V3.7C5.55 3.31 5.86 3 6.25 3Z" },
      { d: "M8.8 3C9.19 3 9.5 3.31 9.5 3.7V10H8.1V3.7C8.1 3.31 8.41 3 8.8 3Z" },
      { d: "M3 10H9.5V10.6C9.5 11.85 8.62 12.9 7.45 13.15V20.6C7.45 21.15 7 21.6 6.45 21.6H6.05C5.5 21.6 5.05 21.15 5.05 20.6V13.15C3.88 12.9 3 11.85 3 10.6V10Z" },
      { d: "M17.5 2.4C18.9 2.4 20 4.9 20 8.6C20 11.6 19.2 13.6 18 14.2V20.6C18 21.15 17.55 21.6 17 21.6H16.6C16.05 21.6 15.6 21.15 15.6 20.6V14.2C14.5 13.7 14 11.9 14.2 9.4C14.5 5.6 16.1 2.4 17.5 2.4Z" },
    ],
  },
  // History → the real OTKit clock vector, deliberately.
  //
  // OTKit's own glyph for previous visits is a clock WITH a rewind arrow, but it
  // is not in the subset exported into otkitIcons.ts. Two hand-drawn attempts at
  // adding the arrow both read as a blob — a triangle tangent to a circle looks
  // like a map pin, not a rewind — and an approximation that looks broken is
  // worse than the system's own clean vector. So this borrows `clock` until the
  // real glyph is exported, at which point this entry should be deleted and the
  // OTKit spread below will pick it up automatically.
  "history": OTKIT_ICONS.clock,
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
