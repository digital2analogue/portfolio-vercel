/**
 * Reservation detail (iOS) — the dataset behind the modular-layout demo
 * (components/demos/ReservationDetailDemo).
 *
 * Source of truth: the redesigned iOS Restaurant reservation-detail screen shown
 * in `public/projects/images/ot-reservations-ios-modular-layout.gif`. That clip
 * opens on the legacy screen, switches design via the overflow menu, and lands
 * on the layout modelled here — the "after" half of the before/after.
 *
 * The screen is the case study's modularity argument in one view: every zone is
 * a discrete, repeatable pattern (identity row → quick-entry rows → note
 * sections → history) and the note tab strip is a scroll anchor over those
 * sections, not a set of swap-in panels. Section order below IS the render
 * order, and the tab strip is derived from it — adding a note type is one entry
 * here, never a layout change.
 *
 * Sample guest data is fictional and matches the demo footage.
 */

/** One recorded guestbook note. */
export type Note = { id: string; text: string; author: string; date: string };

/** A note section: one tab in the strip, one anchored block in the scroll body. */
export type NoteSection = {
  id: string;
  /** Tab affordance — the strip is icon-only, so this is the accessible name. */
  label: string;
  /** Icon key resolved in the demo component (OTKit set, or supplementary). */
  icon: string;
  /** Empty-state row, rendered when the section has no notes. The section's own
   *  label carries the category, so this does not repeat it. */
  placeholder: string;
  /** Recorded notes, newest first. Omitted on `history`, which renders its own. */
  notes?: Note[];
};

export const NOTE_SECTIONS: NoteSection[] = [
  {
    id: "general",
    label: "General notes",
    icon: "receipt",
    placeholder: "Add a note",
    notes: [
      {
        id: "gen-1",
        text: "Celebrating a 10th anniversary. Wife\u2019s name is Dana — greet by name at the door.",
        author: "Priya N.",
        date: "Oct 24",
      },
    ],
  },
  {
    id: "special",
    label: "Special relationship",
    icon: "star",
    placeholder: "Add a note",
    notes: [
      {
        id: "sp-1",
        text: "Friend of the owner. Comp the first round; do not present a check for dessert.",
        author: "M. Alvarez",
        date: "Aug 12",
      },
    ],
  },
  {
    id: "food",
    label: "Food & drink preferences",
    icon: "utensils",
    placeholder: "Add a note",
    notes: [
      {
        id: "food-1",
        text: "Severe shellfish allergy — no cross-contact. Kitchen must be told on seating.",
        author: "Priya N.",
        date: "Oct 24",
      },
    ],
  },
  {
    id: "seating",
    label: "Seating preferences",
    icon: "seat",
    placeholder: "Add a note",
    notes: [
      {
        id: "seat-1",
        text: "Prefers a banquette away from the kitchen pass. Has declined table 6 twice.",
        author: "Dev R.",
        date: "May 4",
      },
    ],
  },
  { id: "history", label: "History", icon: "history", placeholder: "" },
];

/** The four history counters, each rendered as a circle + label + group sub-count. */
export type HistoryStat = { id: string; value: number; label: string; sub: string };

export const HISTORY_STATS: HistoryStat[] = [
  { id: "visits", value: 3, label: "Visits", sub: "3 Group" },
  { id: "upcoming", value: 1, label: "Upcoming", sub: "1 Group" },
  { id: "cancellations", value: 0, label: "Cancellations", sub: "0 Group" },
  { id: "no-shows", value: 0, label: "No-shows", sub: "0 Group" },
];

/** One line in a visit's activity log. */
export type VisitEvent = {
  id: string;
  icon: string;
  time: string;
  text: string;
  /** Who recorded it, when the log line has an author. */
  author?: string;
  /** Secondary status line under the entry. */
  meta?: string;
  /** Table number badge on the right of the row. */
  table?: string;
};

export type Visit = { id: string; heading: string; events: VisitEvent[] };

/** The "Current visit" scope — day-of activity for the reservation on screen. */
export const CURRENT_VISIT: Visit[] = [
  {
    id: "oct-27",
    heading: "Fri, Oct 27 · Day of visit",
    events: [
      {
        id: "booked",
        icon: "menu",
        time: "9:01 am",
        text: "Booked for Oct 27 at 6:45 am, party of 4",
        author: "Alex",
        meta: "SMS disabled",
        table: "24",
      },
    ],
  },
];

/** The "All visits" scope — the same log widened to the guest's full history. */
export const ALL_VISITS: Visit[] = [
  ...CURRENT_VISIT,
  {
    id: "aug-12",
    heading: "Sat, Aug 12 · Completed",
    events: [
      {
        id: "aug-seated",
        icon: "seat",
        time: "7:12 pm",
        text: "Seated at 7:12 pm, party of 2",
        meta: "Anniversary noted by host",
        table: "11",
      },
    ],
  },
  {
    id: "may-04",
    heading: "Thu, May 4 · Completed",
    events: [
      {
        id: "may-booked",
        icon: "menu",
        time: "6:40 pm",
        text: "Booked for May 4 at 7:00 pm, party of 4",
        author: "Sam",
        table: "8",
      },
    ],
  },
];

/** The guest + reservation the screen is showing. */
export const RESERVATION = {
  guest: "Mark Schroeder",
  initials: "MS",
  time: "6:45 am",
  partySize: 4,
  table: "24",
  /** Guest tags, shown as chips on the tag row. Tags are how staff classify a
   *  guest — allergies and relationships are tags, not note types. Each carries
   *  a category glyph + tone so the row is scannable before it is read; the
   *  label always states the category too, so colour is never the only channel. */
  // Glyphs follow OTKit's note-category semantics, so a tag and its matching
  // note section read as the same thing: star = relationship (VIP, friend of),
  // utensils = food & drink incl. allergies, seat = seating, history = previous
  // visits. VIP and Friend of owner share the star and separate on tone.
  // Anniversary is an occasion, which the category set doesn't name — cocktail
  // is the closest available glyph and the one call here that isn't specified.
  tags: [
    { label: "VIP", icon: "star", tone: "vip" },
    { label: "Shellfish allergy", icon: "utensils", tone: "alert" },
    { label: "Friend of owner", icon: "star", tone: "relationship" },
    { label: "Anniversary", icon: "cocktail", tone: "occasion" },
  ],
  /** Note attached to this visit specifically, not the guest's guestbook. */
  visitNote: "Requested the corner banquette when booking. Confirmed by phone.",
  tagPlaceholder: "Add a tag…",
  visitNotePlaceholder: "Add a visit note",
} as const;

/**
 * Resolve the active tab from a scroll position: the last section whose top has
 * crossed the strip, so the strip tracks the section actually under it. Offsets
 * are section top positions relative to the same scroll container, in render
 * order. Pure so the scroll-spy is unit-testable without a DOM.
 */
export function activeSectionAt(scrollTop: number, offsets: number[]): number {
  let active = 0;
  for (let i = 0; i < offsets.length; i++) {
    // 1px of slack absorbs sub-pixel scroll positions after a programmatic jump.
    if (offsets[i] - 1 <= scrollTop) active = i;
    else break;
  }
  return active;
}
