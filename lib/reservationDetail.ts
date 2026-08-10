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

/**
 * Tag categories — the same taxonomy the note sections use, so a glyph means one
 * thing across the whole screen. Each carries its own tone; every tone clears
 * 3:1 on white so the glyph reads as a UI mark rather than decoration (OTKit's
 * accent-yellow #FDAF08 is 1.86:1, hence the darkened #A97405).
 */
export type TagCategory = "relationship" | "food" | "seating" | "general";

export const TAG_CATEGORY: Record<TagCategory, { icon: string; tone: string }> = {
  relationship: { icon: "star", tone: "relationship" },
  food: { icon: "utensils", tone: "food" },
  seating: { icon: "seat", tone: "seating" },
  general: { icon: "receipt", tone: "general" },
};

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
        text: "Requested the corner banquette when booking. Confirmed by phone.",
        author: "Priya N.",
        date: "Oct 24",
      },
      {
        id: "seat-2",
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
  /** Guest tags. A tag names a CATEGORY, and the category supplies the glyph and
   *  the tone — so two tags in one category (VIP and Friend of owner are both
   *  relationship) cannot drift apart, and a star means the same thing wherever
   *  it appears. The label always states the category too, so colour is
   *  reinforcement and never the only channel. */
  tags: [
    { label: "VIP", category: "relationship" },
    { label: "Friend of owner", category: "relationship" },
    { label: "Shellfish allergy", category: "food" },
    { label: "Anniversary", category: "general" },
  ] as { label: string; category: TagCategory }[],
  tagPlaceholder: "Add a tag…",
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

/**
 * iPad (Front of House) shell data — the chrome the tablet layout adds around the
 * SAME zones the phone shows. The reservation record itself is unchanged: this
 * is only the rail, the service sidebar and the date bar.
 *
 * That is the case study's claim made literal. Nothing about the guest record is
 * re-authored for tablet; the zones are re-composed and two of them (status +
 * table, pacing + referral) move out to a side panel because there is now room
 * for them to sit beside the record instead of under it.
 */
/** A glyph shown against a row, in one of the FOH accent tones. */
export type RowGlyph = { icon: string; tone?: "fuchsia" | "green" | "yellow" | "blue" | "purple" | "teal" };

export type ServiceRow = {
  id: string;
  /** Leading marker. Per the comp, only ATTENTION states are colour-blocked and
   *  bled to the panel edge (running late, no show) — everything else is a bare
   *  white glyph, so the block means "this one needs you" rather than "this one
   *  exists". Omit `tone` for the bare form. */
  state: RowGlyph;
  /** Reservation status, resolved through lib/reservationStates. The trailing
   *  square on every row IS this control, so the tablet and the status-dropdown
   *  demo share one taxonomy rather than two copies of the same eleven tokens. */
  status: string;
  size: number;
  time: string;
  guest: string;
  /** Inline attribute marks (tags, notes, media) on the right of the row. */
  glyphs: RowGlyph[];
  table?: string;
  selected?: boolean;
};

export type ServiceList = {
  id: string;
  label: string;
  sort: string;
  parties: number;
  covers: number;
  /** Quoted-wait chips, waitlist only. */
  quotes?: string[];
  rows: ServiceRow[];
};

export const IPAD = {
  /** iOS status bar above the service bar. */
  statusBar: { time: "4:30 PM", date: "Fri Oct 27", battery: "100%" },
  service: { covers: 1336, date: "Fri, Oct 27", shift: "Dinner" },
  /** Right-hand button group in the service bar. `menu` is the RESTAURANT menu
   *  here — the bound-book glyph is correct in this slot and wrong as a drawer
   *  affordance, which is what the hamburger on the left is for. */
  navButtons: [
    { icon: "message", label: "Messages", badge: 2 },
    { icon: "edit", label: "Add a shift note", dot: true },
    { icon: "receipt", label: "Reports" },
    { icon: "menu", label: "Menu" },
  ] as { icon: string; label: string; badge?: number; dot?: boolean }[],
  /** The service lists. The selected reservation is the record on screen. */
  lists: [
    {
      id: "waitlist",
      label: "Waitlist",
      sort: "by added time",
      parties: 4,
      covers: 24,
      quotes: ["1", "2", "3", "4", "5"],
      rows: [],
    },
    {
      id: "reservations",
      label: "Reservations",
      sort: "by scheduled time",
      parties: 4,
      covers: 10,
      rows: [
        {
          id: "r-24",
          status: "confirmed",
          state: { icon: "star" },
          size: RESERVATION.partySize,
          time: RESERVATION.time,
          guest: RESERVATION.guest,
          glyphs: [
            { icon: "utensils", tone: "fuchsia" },
            { icon: "seat", tone: "purple" },
            { icon: "star", tone: "yellow" },
          ],
          table: RESERVATION.table,
          selected: true,
        },
        {
          id: "r-32",
          status: "booked",
          state: { icon: "check" },
          size: 2,
          time: "7:00 pm",
          guest: "Magdalena Rodr…",
          glyphs: [
            { icon: "seat", tone: "purple" },
            { icon: "drinks", tone: "green" },
            { icon: "price" },
          ],
          table: "32",
        },
        {
          id: "r-31",
          status: "running-late",
          state: { icon: "clock", tone: "yellow" },
          size: 4,
          time: "7:00 pm",
          guest: "Kadin Westervelt",
          glyphs: [{ icon: "star", tone: "green" }, { icon: "message" }],
          table: "31",
        },
        {
          id: "r-00",
          status: "guest-on-way",
          state: { icon: "nav" },
          size: 2,
          time: "7:15 pm",
          guest: "Haylie Culhane",
          glyphs: [{ icon: "sorbet", tone: "teal" }],
        },
      ],
    },
    {
      id: "seated",
      label: "Seated",
      sort: "by seated time",
      parties: 8,
      covers: 24,
      rows: [
        {
          id: "s-b3",
          status: "entree",
          state: { icon: "seated" },
          size: 3,
          time: "5:30 pm · 1h 5m",
          guest: "Kaylynn Stanton",
          glyphs: [{ icon: "seat", tone: "purple" }, { icon: "price" }],
          table: "b3",
        },
        {
          id: "s-50",
          status: "seated",
          state: { icon: "seated" },
          size: 2,
          time: "5:56 pm · 39m",
          guest: "Yoko Calhoun",
          glyphs: [{ icon: "seat", tone: "purple" }, { icon: "drinks", tone: "green" }],
          table: "50",
        },
      ],
    },
  ] as ServiceList[],
  /** Left icon rail — the app's primary sections, in the comp's order. There is
   *  no footer group and no dock beneath the list panel: the rail ends at the
   *  bell and the panel ends at its last row. */
  rail: [
    { icon: "bars", label: "Shift overview" },
    { icon: "table-outline", label: "Reservations", active: true },
    { icon: "sliders", label: "Pacing" },
    { icon: "presentation", label: "Reports" },
    { icon: "contact-card", label: "Guestbook" },
    { icon: "book-alert", label: "Manual" },
    { icon: "cloche", label: "Server requests" },
  ] as { icon: string; label: string; active?: boolean }[],
  /** Utility glyphs pinned to the foot of the rail. Sign-out is the last of
   *  them and sits level with the dock, in the rail's own column. */
  railFooter: [
    { icon: "gear", label: "Settings" },
    { icon: "info", label: "About" },
    { icon: "exit", label: "Sign out" },
  ] as { icon: string; label: string }[],
  /**
   * Side panel — the reservation's actions, as full-width rows with a leading
   * glyph. Two carry a second line (what the action would actually send), and
   * one is a danger readout rather than an action.
   */
  actions: [
    { id: "assign", icon: "seat", label: "Assign table" },
    { id: "send", icon: "message", label: "Send", sub: "Payment request" },
    { id: "resend", icon: "receipt", label: "Re-send", sub: "Booking confirmation" },
    { id: "message", icon: "message", label: "Message guest" },
  ] as { id: string; icon: string; label: string; sub?: string }[],
  /** Unpaid balance readout — a disclosure, not a button. */
  balance: { label: "Not paid", amount: "$6.00" },
  /** Pre-ordered items, collapsed under their parent. */
  order: {
    label: "Mel’s Mediterranean Meal",
    qty: "1 x",
    items: ["1 x Aloha Maid Juice", "1 x Side of hot sauce"],
  },
  /** Utility dock under the service lists — five tools, no more. */
  dock: [
    { icon: "page", label: "Shift notes", dot: true },
    { icon: "bell", label: "Alerts", badge: 2 },
    { icon: "book-alert", label: "Manual" },
    { icon: "cloche", label: "Server requests" },
    { icon: "bag-minus", label: "No-shows" },
  ] as { icon: string; label: string; badge?: number; dot?: boolean }[],
  /** The record’s own status, same taxonomy as the list rows. */
  status: { id: "confirmed", table: "Table 24", tableState: "Assigned" },
} as const;
