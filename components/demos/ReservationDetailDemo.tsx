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
 * palette (--otk-*, see globals.css). One deliberate departure: the source's
 * secondary bottom action puts muted grey on a grey fill (~3:1); here the label
 * takes --otk-ink for AA, the same repair pattern used in the other OTKit demos.
 *
 * Light-mode by design — the surrounding .demo-frame frames it as a product
 * surface inside the dark portfolio. Keyboard-operable throughout, scroll
 * container focusable, and every programmatic scroll respects
 * prefers-reduced-motion.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { RESERVATION_DETAIL_ICONS } from "./reservationDetailIcons";
import {
  NOTE_SECTIONS,
  HISTORY_STATS,
  CURRENT_VISIT,
  ALL_VISITS,
  RESERVATION,
  activeSectionAt,
  type Visit,
} from "@/lib/reservationDetail";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const g = RESERVATION_DETAIL_ICONS[name] ?? RESERVATION_DETAIL_ICONS.receipt;
  const strokeProps = g.stroke
    ? { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
    : { fill: "currentColor" };
  return (
    <svg className="rd-icon" width={size} height={size} viewBox={g.viewBox} aria-hidden="true" {...strokeProps}>
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

export default function ReservationDetailDemo() {
  const [active, setActive] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [scope, setScope] = useState(0);
  const [excluded, setExcluded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  /** Set while a tab-initiated smooth scroll is in flight, so the spy doesn't
   *  fight the animation and flicker through intermediate sections. */
  const jumping = useRef(false);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseId = useId();

  const sectionOffsets = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return [];
    // The strip is sticky, so a section counts as "reached" once its top passes
    // beneath it — subtract the strip height from every measured offset.
    const stripH = stripRef.current?.offsetHeight ?? 0;
    return sectionRefs.current.map((el) => (el ? el.offsetTop - stripH : 0));
  }, []);

  const onScroll = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    setCollapsed(scroller.scrollTop > COLLAPSE_AT);
    if (jumping.current) return;
    setActive(activeSectionAt(scroller.scrollTop, sectionOffsets()));
  }, [sectionOffsets]);

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

  useEffect(
    () => () => {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
    },
    [],
  );

  /** Roving arrow-key movement across the strip, per the tabs keyboard pattern. */
  const onStripKeyDown = (e: React.KeyboardEvent) => {
    const last = NOTE_SECTIONS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    goToSection(next);
    stripRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  const visits = VISIT_SCOPES[scope].visits;

  return (
    <div className="rr-demo rd">
      <div className="rd-device">
        {/* Device chrome is decoration: it establishes "this is the iOS app",
            and carries no information the screen doesn't already state. */}
        <div className="rd-status" aria-hidden="true">
          <span className="rd-status__time">12:06</span>
          <span className="rd-notch" />
          <span className="rd-status__right">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 9.5 10.5 7a3.5 3.5 0 0 0-5 0L8 9.5ZM8 4a6 6 0 0 1 4.3 1.8l1.1-1.1A7.5 7.5 0 0 0 8 2.5a7.5 7.5 0 0 0-5.4 2.2l1.1 1.1A6 6 0 0 1 8 4Z" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor">
              <rect x="0.5" y="1.5" width="19" height="9" rx="2.5" fill="none" stroke="currentColor" opacity="0.4" />
              <rect x="2" y="3" width="16" height="6" rx="1" />
              <rect x="21" y="4.5" width="2" height="3" rx="1" opacity="0.4" />
            </svg>
          </span>
        </div>

        <header className="rd-header" data-collapsed={collapsed}>
          {/* Both header states are always rendered and cross-faded, so the
              collapse never reflows the layout underneath it. `inert` (not
              aria-hidden) hides the off state: it drops the half from the a11y
              tree AND from focus, where aria-hidden alone would leave focusable
              buttons inside a hidden subtree. */}
          <div className="rd-chiprow" inert={collapsed}>
            <button type="button" className="rd-chip rd-chip--icon">
              <Icon name="chevron-left" />
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
              <Icon name="overflow" />
              <span className="rd-sr">More reservation actions</span>
            </button>
          </div>
          <div className="rd-titlebar" inert={!collapsed}>
            <button type="button" className="rd-titlebar__back">
              <Icon name="chevron-left" />
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
          <div className="rd-row rd-row--guest">
            <span className="rd-avatar">
              <Icon name="person" size={22} />
            </span>
            <h3 className="rd-reset rd-guest">{RESERVATION.guest}</h3>
            <button type="button" className="rd-iconbtn">
              <Icon name="edit" />
              <span className="rd-sr">Edit guest</span>
            </button>
          </div>

          <button type="button" className="rd-row rd-row--action">
            <Icon name="tag" />
            <span className="rd-placeholder">{RESERVATION.tagPlaceholder}</span>
            <Icon name="edit" />
          </button>

          <button type="button" className="rd-row rd-row--action">
            <Icon name="receipt" />
            <span className="rd-placeholder">{RESERVATION.visitNotePlaceholder}</span>
          </button>

          {/* Scroll anchors, not tabs: all five sections stay mounted below, so
              this is navigation within one document, marked with aria-current. */}
          <nav
            className="rd-strip"
            ref={stripRef}
            aria-label="Jump to note section"
            onKeyDown={onStripKeyDown}
          >
            {NOTE_SECTIONS.map((section, i) => (
              <button
                key={section.id}
                type="button"
                className="rd-strip__tab"
                data-active={i === active}
                aria-current={i === active ? "true" : undefined}
                tabIndex={i === active ? 0 : -1}
                onClick={() => goToSection(i)}
              >
                <Icon name={section.icon} />
                <span className="rd-sr">{section.label}</span>
              </button>
            ))}
          </nav>

          {NOTE_SECTIONS.map((section, i) => {
            const isHistory = section.id === "history";
            return (
              <section
                key={section.id}
                id={`${baseId}-${section.id}`}
                aria-label={section.label}
                ref={(el) => {
                  sectionRefs.current[i] = el;
                }}
                className={isHistory ? "rd-section rd-section--history" : "rd-section"}
              >
                {isHistory ? (
                  <>
                    <h3 className="rd-reset rd-heading">
                      <Icon name="history" />
                      History
                    </h3>

                    <ul className="rd-reset rd-stats">
                      {HISTORY_STATS.map((stat) => (
                        <li key={stat.id} className="rd-reset rd-stat">
                          <span className="rd-stat__value">{stat.value}</span>
                          <span className="rd-stat__label">{stat.label}</span>
                          <span className="rd-stat__sub">{stat.sub}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="rd-seg" role="tablist" aria-label="Visit scope">
                      {VISIT_SCOPES.map((s, i2) => (
                        <button
                          key={s.id}
                          type="button"
                          role="tab"
                          id={`${baseId}-scope-${s.id}`}
                          aria-selected={i2 === scope}
                          aria-controls={`${baseId}-visits`}
                          tabIndex={i2 === scope ? 0 : -1}
                          className="rd-seg__btn"
                          data-active={i2 === scope}
                          onClick={() => setScope(i2)}
                          onKeyDown={(e) => {
                            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                            e.preventDefault();
                            setScope((c) => (c === 0 ? 1 : 0));
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <div
                      className="rd-visits"
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
                              <Icon name={event.icon} />
                              <span className="rd-event__time">{event.time}</span>
                              <div className="rd-event__body">
                                <p className="rd-reset rd-event__text">{event.text}</p>
                                {event.author && (
                                  <p className="rd-reset rd-event__meta">
                                    <Icon name="edit" size={14} />
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
                      <Icon name="plus" />
                      <span className="rd-referral">Add a referral</span>
                      <Icon name="chevron-right" />
                    </button>
                  </>
                ) : (
                  <button type="button" className="rd-row rd-row--action">
                    <Icon name={section.icon} />
                    <span className="rd-placeholder">{section.placeholder}</span>
                  </button>
                )}
              </section>
            );
          })}
        </div>

        <div className="rd-actionbar">
          <button type="button" className="rd-action rd-action--primary">
            <Icon name="check" />
            <span className="rd-sr">Confirm reservation</span>
          </button>
          <button type="button" className="rd-action rd-action--secondary">
            <Icon name="seat" />
            <span className="rd-action__table">{RESERVATION.table}</span>
            <span className="rd-sr">Change table assignment</span>
          </button>
        </div>

        <span className="rd-homebar" aria-hidden="true" />
      </div>
    </div>
  );
}
