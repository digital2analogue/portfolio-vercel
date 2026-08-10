"use client";

/**
 * ReservationDetailDemo — a live recreation of the redesigned iOS Restaurant
 * reservation-detail screen from the OT Reservations case study.
 *
 * It replaces a 612KB clip with the thing itself. The clip
 * (ot-reservations-ios-modular-layout.gif) plays a before/after: legacy screen →
 * overflow menu → redesigned screen. This is the "after" half, live, because the
 * argument it makes is structural and only reads when you can drive it:
 *
 *   • Every zone is a discrete, repeatable pattern — identity row, quick-entry
 *     rows, note sections, history — so the layout is predictable for users and
 *     for the engineers assembling it.
 *   • The note strip is a scroll anchor over sections that all stay mounted, not
 *     five swap-in panels. Scrolling moves the strip; the strip moves the scroll.
 *   • The header collapses to a compact title bar on scroll, so the guest's name
 *     and the back affordance survive the whole scroll depth.
 *
 * Faithful to the source screen's layout, type scale and OTKit light-mode
 * palette (--otk-*, see globals.css) — the polish is in execution, not in
 * redesigning what shipped. One deliberate departure: the source's secondary
 * bottom action puts muted grey on a grey fill (~3:1); here the label takes
 * --otk-ink for AA, the same repair pattern used in the other OTKit demos.
 *
 * Motion is measured, not guessed. Three positions are read from the DOM and
 * driven as transforms — the strip indicator, the segment thumb, and the two
 * scroll-elevation edges — so nothing depends on hardcoded geometry. Every
 * transition runs on the parsimony duration tokens, which zero out under
 * prefers-reduced-motion; the ambient entrance is dropped there outright.
 *
 * Light-mode by design — the surrounding .demo-frame frames it as a product
 * surface inside the dark portfolio. Keyboard-operable throughout, scroll
 * container focusable.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { RESERVATION_DETAIL_ICONS } from "./reservationDetailIcons";
import {
  NOTE_SECTIONS,
  HISTORY_STATS,
  CURRENT_VISIT,
  ALL_VISITS,
  RESERVATION,
  TAG_CATEGORY,
  activeSectionAt,
  type Visit,
} from "@/lib/reservationDetail";

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const g = RESERVATION_DETAIL_ICONS[name] ?? RESERVATION_DETAIL_ICONS.receipt;
  return (
    <svg
      className={className ? `rd-icon ${className}` : "rd-icon"}
      width={size}
      height={size}
      viewBox={g.viewBox}
      aria-hidden="true"
      fill={g.stroke ? "none" : "currentColor"}
      stroke={g.stroke ? "currentColor" : undefined}
      strokeWidth={g.stroke ? 1.7 : undefined}
      strokeLinecap={g.stroke ? "round" : undefined}
      strokeLinejoin={g.stroke ? "round" : undefined}
    >
      {g.paths.map((pth, i) => (
        <path key={i} d={pth.d} fillRule={pth.fillRule} clipRule={pth.clipRule} />
      ))}
    </svg>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Scroll depth (px) past which the top chip row swaps for the compact title. */
const COLLAPSE_AT = 56;

const VISIT_SCOPES: { id: string; label: string; visits: Visit[] }[] = [
  { id: "current", label: "Current visit", visits: CURRENT_VISIT },
  { id: "all", label: "All visits", visits: ALL_VISITS },
];

/**
 * One selection strip, used twice: the note strip (sticky, glyphs, scroll
 * anchors) and the visit scope (inline, words, panel swap). They were built as
 * two components, which is how their active colours drifted apart and how the
 * scope indicator came to hardcode "exactly two, equal width" while the note
 * strip measured itself.
 *
 * The measuring lives here so the indicator generalises to any count and to
 * unequal widths. Semantics stay the caller's: the note strip is navigation over
 * always-mounted sections (aria-current), the scope is a real tablist over a
 * panel (aria-selected) — same control, different meaning, so the roles differ
 * while the behaviour does not.
 */
export function SelectStrip({
  items,
  active,
  onSelect,
  mode,
  ariaLabel,
  sticky = false,
  stuck = false,
  itemAttrs,
  stripRef,
  itemRefs,
  onKeyDown,
  className,
  style,
}: {
  items: { id: string; content: React.ReactNode; label: string }[];
  active: number;
  onSelect: (i: number) => void;
  mode: "nav" | "tabs";
  ariaLabel: string;
  sticky?: boolean;
  stuck?: boolean;
  itemAttrs?: (i: number) => Record<string, unknown>;
  stripRef?: React.RefObject<HTMLDivElement | null>;
  itemRefs?: React.RefObject<(HTMLButtonElement | null)[]>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Extra classes ON the strip element. A sticky strip must not be wrapped —
   *  its containing block would become the wrapper and it would never stick —
   *  so anything the caller wants to add (the entrance zone) lands here. */
  className?: string;
  style?: React.CSSProperties;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const root = stripRef ?? localRef;
  const localItems = useRef<(HTMLButtonElement | null)[]>([]);
  const buttons = itemRefs ?? localItems;
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = buttons.current[active];
      if (el) setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const el = root.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, root, buttons]);

  const Tag = mode === "nav" ? "nav" : "div";
  return (
    <Tag
      className={["rd-select", sticky && "rd-select--sticky", className].filter(Boolean).join(" ")}
      style={style}
      ref={root as React.RefObject<HTMLDivElement & HTMLElement>}
      aria-label={ariaLabel}
      role={mode === "tabs" ? "tablist" : undefined}
      onKeyDown={onKeyDown}
      data-stuck={sticky ? stuck : undefined}
      data-ready={indicator !== null}
    >
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          className="rd-select__item"
          ref={(el) => {
            buttons.current[i] = el;
          }}
          data-active={i === active}
          tabIndex={i === active ? 0 : -1}
          onClick={() => onSelect(i)}
          {...(itemAttrs?.(i) ?? {})}
        >
          {item.content}
          <span className="rd-sr">{item.label}</span>
        </button>
      ))}
      <span
        className="rd-select__indicator"
        aria-hidden="true"
        style={{
          transform: indicator ? `translateX(${indicator.x}px) scaleX(${indicator.w})` : undefined,
        }}
      />
    </Tag>
  );
}

/**
 * The note strip's behaviour: sections stay mounted, scrolling moves the strip,
 * the strip moves the scroll. Extracted because the tablet composition needs the
 * identical behaviour over the identical sections — and a second hand-rolled copy
 * is exactly how the two selection strips drifted apart the first time.
 *
 * The caller owns the scroll handler (each shell tracks its own extra state off
 * the same scroll event) and calls `spy(scrollTop)` from inside it.
 */
export function useSectionSpy(count: number) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** Set while a tab-initiated smooth scroll is in flight, so the spy doesn't
   *  fight the animation and flicker through intermediate sections. */
  const jumping = useRef(false);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionOffsets = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return [];
    // The strip is sticky, so a section counts as "reached" once its top passes
    // beneath it — subtract the strip height from every measured offset.
    const stripH = stripRef.current?.offsetHeight ?? 0;
    return sectionRefs.current.map((el) => (el ? el.offsetTop - stripH : 0));
  }, []);

  const spy = useCallback(
    (top: number) => {
      if (jumping.current) return;
      setActive(activeSectionAt(top, sectionOffsets()));
    },
    [sectionOffsets],
  );

  const goToSection = useCallback(
    (index: number) => {
      const scroller = scrollRef.current;
      const target = sectionRefs.current[index];
      if (!scroller || !target) return;
      setActive(index);
      const reduced = prefersReducedMotion();
      const top = sectionOffsets()[index];
      if (!reduced) {
        jumping.current = true;
        if (jumpTimer.current) clearTimeout(jumpTimer.current);
        // No cross-browser "scroll settled" event; release the spy after the
        // smooth scroll's own duration so it resumes tracking real input.
        jumpTimer.current = setTimeout(() => {
          jumping.current = false;
        }, 600);
      }
      scroller.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    },
    [sectionOffsets],
  );

  /** Roving arrow-key movement across the strip, per the tabs keyboard pattern. */
  const onStripKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const last = count - 1;
      let next: number | null = null;
      if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
      else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      goToSection(next);
      tabRefs.current[next]?.focus();
    },
    [active, count, goToSection],
  );

  useEffect(
    () => () => {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
    },
    [],
  );

  return { active, scrollRef, sectionRefs, stripRef, tabRefs, spy, goToSection, onStripKeyDown };
}

/**
 * One-shot entrance when the device scrolls into view.
 *
 * Driven straight onto the DOM node rather than through React state: the reveal
 * is presentation with no bearing on what the component renders, and routing it
 * through state would re-render the whole screen twice for an opacity ramp. It
 * also makes the markup fail safe — the hidden-then-reveal styles key off
 * `data-entered`, which only ever gets set once an observer is actually armed,
 * so a browser without IntersectionObserver (or a reader who asked for reduced
 * motion) simply renders the finished screen. useLayoutEffect so arming lands
 * before paint and nothing flashes.
 */
export function useEntrance<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    el.dataset.entered = "false";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.entered = "true";
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Render order of the zones the entrance reveal walks down. */
const ZONE = { guest: 0, tag: 1, strip: 2, sections: 3 };

export default function ReservationDetailDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [floating, setFloating] = useState(true);
  // Direction travels with the index so the visit panel can enter from the side
  // the user moved from, rather than always fading in place.
  const [scopeState, setScopeState] = useState({ i: 0, dir: 1 });
  const scope = scopeState.i;
  const setScope = useCallback(
    (i: number) => setScopeState((s) => (i === s.i ? s : { i, dir: i > s.i ? 1 : -1 })),
    [],
  );
  const [excluded, setExcluded] = useState(false);

  const screenRef = useEntrance<HTMLDivElement>();
  const baseId = useId();
  const { active, scrollRef, sectionRefs, stripRef, tabRefs, spy, goToSection, onStripKeyDown } =
    useSectionSpy(NOTE_SECTIONS.length);

  const onScroll = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const top = scroller.scrollTop;
    setCollapsed(top > COLLAPSE_AT);
    // The strip earns its shadow only once it is genuinely pinned, and the
    // action bar keeps its own only while content still runs beneath it.
    setStuck(top >= (stripRef.current?.offsetTop ?? Infinity));
    setFloating(top + scroller.clientHeight < scroller.scrollHeight - 2);
    spy(top);
  }, [scrollRef, stripRef, spy]);

  const visits = VISIT_SCOPES[scope].visits;
  const zone = (i: number) => ({ "--rd-i": i }) as React.CSSProperties;

  return (
    <div className="rr-demo rd">
      <div className="rd-device">
        <div className="rd-screen" ref={screenRef}>
          {/* Device chrome is decoration: it establishes "this is the iOS app",
              and carries no information the screen doesn't already state. */}
          <div className="rd-status" aria-hidden="true">
            <span className="rd-status__time">12:06</span>
            <span className="rd-notch" />
            <span className="rd-status__right">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                <path d="M8.5 10 11 7.4a3.6 3.6 0 0 0-5 0L8.5 10ZM8.5 4.2c1.7 0 3.2.7 4.4 1.8l1.2-1.2A8 8 0 0 0 8.5 2.4 8 8 0 0 0 2.9 4.8l1.2 1.2a6.3 6.3 0 0 1 4.4-1.8Z" />
              </svg>
              <svg width="26" height="12" viewBox="0 0 26 12" fill="currentColor">
                <rect x="0.6" y="1.1" width="21" height="10" rx="3" fill="none" stroke="currentColor" opacity="0.38" />
                <rect x="2.1" y="2.6" width="18" height="7" rx="1.8" />
                <path d="M23.2 4.4v3.4a2 2 0 0 0 0-3.4Z" opacity="0.38" />
              </svg>
            </span>
          </div>

          <header className="rd-header" data-collapsed={collapsed} data-scrolled={collapsed || stuck}>
            {/* Both header states are always rendered and cross-faded, so the
                collapse never reflows the layout underneath it. `inert` (not
                aria-hidden) hides the off state: it drops the half from the a11y
                tree AND from focus, where aria-hidden alone would leave focusable
                buttons inside a hidden subtree. */}
            <div className="rd-chiprow" inert={collapsed}>
              <button type="button" className="rd-chip rd-chip--icon">
                <Icon name="chevron-left" size={24} />
                <span className="rd-sr">Back to floor plan</span>
              </button>
              <button type="button" className="rd-chip">
                <Icon name="clock" size={16} />
                <span>{RESERVATION.time}</span>
                <span className="rd-sr">Change reservation time</span>
              </button>
              <button type="button" className="rd-chip">
                <Icon name="person" size={16} />
                <span>{RESERVATION.partySize}</span>
                <span className="rd-sr">Change party size</span>
              </button>
              <button type="button" className="rd-chip rd-chip--icon">
                <Icon name="overflow" size={24} />
                <span className="rd-sr">More reservation actions</span>
              </button>
            </div>
            <div className="rd-titlebar" inert={!collapsed}>
              <button type="button" className="rd-titlebar__back">
                <Icon name="chevron-left" size={24} />
                <span className="rd-sr">Back to floor plan</span>
              </button>
              <span className="rd-titlebar__name">{RESERVATION.guest}</span>
            </div>
          </header>

          <div
            className="rd-scroll"
            ref={scrollRef}
            onScroll={onScroll}
            tabIndex={0}
            role="group"
            aria-label={`Reservation details for ${RESERVATION.guest}`}
          >
            <div className="rd-row rd-row--guest rd-zone" style={zone(ZONE.guest)}>
              {(
                <span className="rd-avatar" aria-hidden="true">
                  {RESERVATION.initials}
                </span>
              )}
              <h3 className="rd-reset rd-guest">{RESERVATION.guest}</h3>
              <button type="button" className="rd-iconbtn">
                <Icon name="edit" size={16} />
                <span className="rd-sr">Edit guest</span>
              </button>
            </div>

            <button type="button" className="rd-row rd-row--action rd-row--tags rd-zone" style={zone(ZONE.tag)}>
              <Icon name="tag" size={24} />
              <span className="rd-tags">
                {RESERVATION.tags.map((tag) => {
                  const cat = TAG_CATEGORY[tag.category];
                  return (
                    <span key={tag.label} className="rd-tag" data-tone={cat.tone}>
                      <Icon name={cat.icon} size={16} />
                      {tag.label}
                    </span>
                  );
                })}
              </span>
              <Icon name="edit" size={16} />
              <span className="rd-sr">Edit tags</span>
            </button>

            {/* Scroll anchors, not tabs: all five sections stay mounted below, so
                this is navigation within one document, marked with aria-current.

                NOT wrapped in an .rd-zone div. It was, for the entrance cascade,
                and that silently disabled the sticky: a sticky element sticks
                within its PARENT, and the wrapper was exactly as tall as the
                strip, so it scrolled away with it and never pinned. The zone
                class goes on the strip itself. */}
            <SelectStrip
              mode="nav"
              sticky
              stuck={stuck}
              className="rd-zone"
              style={zone(ZONE.strip)}
              ariaLabel="Jump to note section"
              stripRef={stripRef}
              itemRefs={tabRefs}
              onKeyDown={onStripKeyDown}
              active={active}
              onSelect={goToSection}
              items={NOTE_SECTIONS.map((section) => ({
                id: section.id,
                label: section.label,
                content: <Icon name={section.icon} size={24} />,
              }))}
              itemAttrs={(i) => ({ "aria-current": i === active ? "true" : undefined })}
            />

            {NOTE_SECTIONS.map((section, i) => {
              const isHistory = section.id === "history";
              return (
                <section
                  key={section.id}
                  id={`${baseId}-${section.id}`}
                  aria-labelledby={`${baseId}-${section.id}-label`}
                  ref={(el) => {
                    sectionRefs.current[i] = el;
                  }}
                  className={`rd-section rd-zone${isHistory ? " rd-section--history" : ""}`}
                  style={zone(ZONE.sections + i)}
                >
                  <h3 className="rd-reset rd-seclabel" id={`${baseId}-${section.id}-label`}>
                    <Icon name={section.icon} size={16} />
                    {section.label}
                  </h3>
                  {isHistory ? (
                    <>
                      <ul className="rd-reset rd-stats">
                        {HISTORY_STATS.map((stat) => (
                          <li key={stat.id} className="rd-reset rd-stat">
                            <span className="rd-stat__value">{stat.value}</span>
                            <span className="rd-stat__label">{stat.label}</span>
                            <span className="rd-stat__sub">{stat.sub}</span>
                          </li>
                        ))}
                      </ul>

                      <SelectStrip
                        mode="tabs"
                        ariaLabel="Visit scope"
                        active={scope}
                        onSelect={setScope}
                        items={VISIT_SCOPES.map((sc) => ({
                          id: sc.id,
                          label: sc.label,
                          content: <span aria-hidden="true">{sc.label}</span>,
                        }))}
                        itemAttrs={(i2) => ({
                          role: "tab",
                          id: `${baseId}-scope-${VISIT_SCOPES[i2].id}`,
                          "aria-selected": i2 === scope,
                          "aria-controls": `${baseId}-visits`,
                          onKeyDown: (e: React.KeyboardEvent) => {
                            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                            e.preventDefault();
                            setScope(scope === 0 ? 1 : 0);
                          },
                        })}
                      />

                      <div
                        className="rd-visits"
                        key={scope}
                        data-dir={scopeState.dir}
                        id={`${baseId}-visits`}
                        role="tabpanel"
                        aria-labelledby={`${baseId}-scope-${VISIT_SCOPES[scope].id}`}
                        tabIndex={-1}
                      >
                        {visits.map((visit) => (
                          <div key={visit.id} className="rd-visit">
                            <h4 className="rd-reset rd-visit__heading">{visit.heading}</h4>
                            {visit.events.map((event) => (
                              <div key={event.id} className="rd-event">
                                <Icon name={event.icon} size={16} />
                                <span className="rd-event__time">{event.time}</span>
                                <div className="rd-event__body">
                                  <p className="rd-reset rd-event__text">{event.text}</p>
                                  {event.author && (
                                    <p className="rd-reset rd-event__meta">
                                      <Icon name="edit" size={16} />
                                      {event.author}
                                    </p>
                                  )}
                                  {event.meta && <p className="rd-reset rd-event__meta">{event.meta}</p>}
                                </div>
                                {event.table && (
                                  <span className="rd-event__table">
                                    <Icon name="seat" size={16} />
                                    {event.table}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div className="rd-row rd-row--switch">
                        <label className="rd-switch" htmlFor={`${baseId}-pacing`}>
                          <span className="rd-switch__label">Exclude party from pacing limit</span>
                          <input
                            id={`${baseId}-pacing`}
                            type="checkbox"
                            role="switch"
                            checked={excluded}
                            onChange={(e) => setExcluded(e.target.checked)}
                          />
                          <span className="rd-switch__track" aria-hidden="true">
                            <span className="rd-switch__thumb" />
                          </span>
                        </label>
                      </div>

                      <button type="button" className="rd-row rd-row--action rd-row--referral">
                        <Icon name="plus" size={24} />
                        <span className="rd-referral">Add a referral</span>
                        <Icon name="chevron-right" size={24} className="rd-chevron" />
                      </button>
                    </>
                  ) : section.notes?.length ? (
                    section.notes.map((note) => (
                      <button type="button" key={note.id} className="rd-row rd-row--action rd-row--note">
                        <span className="rd-note">
                          <span className="rd-notetext">{note.text}</span>
                          {/* Attribution is what makes a guestbook note actionable
                              — a server needs to know who logged it and when. */}
                          <span className="rd-noteby">
                            {note.author} · {note.date}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <button type="button" className="rd-row rd-row--action">
                      <span className="rd-placeholder">{section.placeholder}</span>
                    </button>
                  )}
                </section>
              );
            })}
          </div>

          <div className="rd-actionbar" data-floating={floating}>
            <button type="button" className="rd-action rd-action--primary">
              <Icon name="check" size={24} />
              <span className="rd-action__label">Completed</span>
            </button>
            <button type="button" className="rd-action rd-action--secondary">
              <Icon name="seat" size={24} />
              <span className="rd-action__table">{RESERVATION.table}</span>
              <span className="rd-sr">Change table assignment</span>
            </button>
          </div>

          <span className="rd-homebar" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

