"use client";

/**
 * ReservationDetailIPad — the Back-of-House tablet layout from
 * `public/projects/images/zwVjhA3cW2v1jFcL.gif`. Like the phone clip, that one
 * plays a before/after; this is the "after".
 *
 * It exists to make the case study's claim checkable rather than asserted. The
 * guest record is NOT re-authored for tablet: this file imports the same data as
 * the phone demo, reuses the same `SelectStrip`, and renders the same `.rd-*`
 * classes for every zone it shares. What changes is composition — the shell adds
 * a rail, a service sidebar and a date bar, and two zones (status + table,
 * pacing + referral) move out to a side panel because there is finally room for
 * them beside the record instead of under it.
 *
 * That is why this is a separate component rather than a `variant` prop on the
 * phone: the phone's variants are re-SKINS of one DOM, and this is a genuinely
 * different composition of the same parts. Sharing the data and the CSS is what
 * keeps them honest; sharing the markup would have meant a layout prop that
 * rearranged everything, which is a worse abstraction than two compositions.
 */

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { Icon, SelectStrip, useEntrance, useSectionSpy } from "./ReservationDetailDemo";
import {
  NOTE_SECTIONS,
  HISTORY_STATS,
  CURRENT_VISIT,
  ALL_VISITS,
  RESERVATION,
  TAG_CATEGORY,
  IPAD,
  type Visit,
} from "@/lib/reservationDetail";
import { stateById } from "@/lib/reservationStates";

/** Shell width in px — kept in step with .rdp-device min-width in globals.css. */
const SHELL_WIDTH = 848;
/** Shell height in px (screen + device padding), for the teaser's stage box. */
const SHELL_HEIGHT = 596;

const SCOPES: { id: string; label: string; visits: Visit[] }[] = [
  { id: "current", label: "Current visit", visits: CURRENT_VISIT },
  { id: "all", label: "All visits", visits: ALL_VISITS },
];

export default function ReservationDetailIPad() {
  const [scope, setScope] = useState(0);
  const [excluded, setExcluded] = useState(false);
  const [stuck, setStuck] = useState(false);
  /** Phone-width only: the shell is 848px, so it rests as a tappable teaser and
   *  opens full-screen rather than rendering as an illegible sliver. */
  const [expanded, setExpanded] = useState(false);
  const baseId = useId();
  const screenRef = useEntrance<HTMLDivElement>();
  const { active, scrollRef, sectionRefs, stripRef, tabRefs, spy, goToSection, onStripKeyDown } =
    useSectionSpy(NOTE_SECTIONS.length);

  const onScroll = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const top = scroller.scrollTop;
    setStuck(top >= (stripRef.current?.offsetTop ?? Infinity));
    spy(top);
  }, [scrollRef, stripRef, spy]);

  /**
   * Teaser scale, MEASURED rather than declared. There is no CSS unit that turns
   * a container width into a unitless scale factor (calc(100cqw / 848) resolves
   * to a length, which scale() rejects), and a hardcoded factor is wrong at
   * every viewport but one. So the shell's own width sets it, and the stage's
   * height follows from the same number — no dead band, no crop.
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setFit(Math.min(1, el.clientWidth / SHELL_WIDTH));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zone = (i: number) => ({ "--rd-i": i }) as React.CSSProperties;
  const recordState = stateById(IPAD.status.id);

  return (
    <div
      className="rr-demo rd rdp"
      data-expanded={expanded}
      ref={rootRef}
      style={fit === null ? undefined : ({ "--rdp-fit": fit } as React.CSSProperties)}
    >
      {/* Phone-width affordance. The shell is 848px wide and panning it inside a
          vertically-scrolling page is a poor trade, so below 700px it rests as a
          scaled, inert teaser and opens full-screen on tap — the same bargain the
          decision-engine embed makes, minus the round trip, because this
          prototype is live in the page rather than in an iframe. */}
      <button type="button" className="rdp-tap" onClick={() => setExpanded(true)}>
        <span className="rdp-tap__cta">
          <span className="rdp-tap__dot" aria-hidden="true" />
          Tap to view prototype
        </span>
      </button>
      <div
        className="rdp-stage"
        style={fit === null ? undefined : ({ "--rdp-fit-h": `${Math.round(SHELL_HEIGHT * fit)}px` } as React.CSSProperties)}
      >
        <button
          type="button"
          className="rdp-close"
          onClick={() => setExpanded(false)}
          aria-label="Close the prototype"
        >
          <Icon name="plus" size={20} />
        </button>
      <div className="rdp-device">
        <div className="rdp-screen" ref={screenRef}>
          {/* Service bar. Faithful to OTKit's iPad top navigation: an iOS status
              row, then a nav row whose date and shift are OUTLINED chips, not
              filled ones. The fill I had used sat at 1.31:1 against the bar and
              was doing the border's job badly. */}
          <div className="rdp-statusbar" aria-hidden="true">
            <span>
              {IPAD.statusBar.time} <b>{IPAD.statusBar.date}</b>
            </span>
            <span className="rdp-battery">
              {IPAD.statusBar.battery}
              <span className="rdp-batt" />
            </span>
          </div>
          <div className="rdp-topbar">
            <button type="button" className="rdp-icon rdp-icon--bare" aria-label="Open navigation">
              <Icon name="hamburger" size={24} />
            </button>
            <div className="rdp-datebar">
              <span className="rdp-covers">
                <Icon name="person" size={20} />
                {IPAD.service.covers.toLocaleString("en-US")}
              </span>
              <button type="button" className="rdp-chip rdp-chip--step" aria-label="Previous day">
                <Icon name="chevron-left" size={16} />
              </button>
              <span className="rdp-chip rdp-chip--date">{IPAD.service.date}</span>
              {/* Service is live. A dot alone would be colour-as-only-channel, so
                  it carries a text alternative rather than a tooltip. */}
              <span className="rdp-live" role="img" aria-label="Service is live">
                <span className="rdp-live__dot" />
              </span>
              <span className="rdp-chip rdp-chip--date">{IPAD.service.shift}</span>
              <button type="button" className="rdp-chip rdp-chip--step" aria-label="Next day">
                <Icon name="chevron-right" size={16} />
              </button>
            </div>
            <div className="rdp-views">
              {IPAD.navButtons.map((btn) => (
                <button key={btn.icon} type="button" className="rdp-chip rdp-chip--nav" aria-label={btn.label}>
                  <Icon name={btn.icon} size={20} />
                  {btn.badge ? (
                    <span className="rdp-badge">
                      {btn.badge}
                      <span className="rd-sr"> unread</span>
                    </span>
                  ) : null}
                  {btn.dot ? <span className="rdp-newdot" aria-hidden="true" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="rdp-body">
            {/* Primary sections. The rail is 40px and glyph-only, so the active
                section is marked by an accent edge rather than a fill: a raised
                fill on this panel is 1.31:1 and would be the only difference
                between the current section and its neighbours. */}
            <nav className="rdp-rail" aria-label="Sections">
              {IPAD.rail.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  className="rdp-railbtn rdp-sel"
                  data-selected={r.active}
                  aria-current={r.active ? "page" : undefined}
                >
                  <Icon name={r.icon} size={20} />
                  <span className="rd-sr">{r.label}</span>
                </button>
              ))}
              <span className="rdp-rail__spacer" />
              {IPAD.railFooter.map((r) => (
                <button key={r.label} type="button" className="rdp-railbtn">
                  <Icon name={r.icon} size={20} />
                  <span className="rd-sr">{r.label}</span>
                </button>
              ))}
            </nav>

            <aside className="rdp-sidebar" aria-label="Service lists">
              <div className="rdp-lists">
                {IPAD.lists.map((list) => (
                  <section key={list.id} aria-labelledby={`${baseId}-${list.id}`}>
                    <div className="rdp-listhead">
                      <span className="rdp-listhead__title">
                        <b id={`${baseId}-${list.id}`}>{list.label}</b>
                        <i>{list.sort}</i>
                      </span>
                      <span className="rdp-counts">
                        <Icon name="person" size={16} />
                        {list.parties}
                        <Icon name="seat" size={16} />
                        {list.covers}
                      </span>
                      <button type="button" className="rdp-chip rdp-chip--step" aria-label={`Collapse ${list.label}`}>
                        <Icon name="chevron-left" size={16} className="rdp-caret" />
                      </button>
                    </div>

                    {list.quotes ? (
                      <div className="rdp-quotes" role="group" aria-label="Quoted wait times">
                        {list.quotes.map((t) => (
                          <button key={t} type="button" className="rdp-quote">
                            <span className="rdp-quote__unit">3h+</span>
                            <span className="rdp-quote__n">{t}</span>
                          </button>
                        ))}
                        <button type="button" className="rdp-quote rdp-quote--add" aria-label="Add a quoted wait">
                          <Icon name="plus" size={20} />
                        </button>
                      </div>
                    ) : null}

                    {list.rows.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        className="rdp-resv rdp-sel"
                        data-selected={r.selected}
                        aria-current={r.selected ? "true" : undefined}
                      >
                        <span className="rdp-state" data-tone={r.state.tone}>
                          <Icon name={r.state.icon} size={16} />
                        </span>
                        <span className="rdp-resv__size">{r.size}</span>
                        <span className="rdp-resv__body">
                          <span className="rdp-resv__time">{r.time}</span>
                          <span className="rdp-resv__name">{r.guest}</span>
                        </span>
                        <span className="rdp-marks" aria-hidden="true">
                          {r.glyphs.map((g, gi) => (
                            <span key={gi} data-tone={g.tone}>
                              <Icon name={g.icon} size={16} />
                            </span>
                          ))}
                        </span>
                        {/* The trailing control is the reservation STATUS, not
                            the table — same taxonomy as the status-dropdown demo
                            on the sibling case study, resolved through
                            stateById so there is one source for the eleven
                            tokens the 22 states collapse onto. The table number
                            rides above it, as it does in the source panel. */}
                        <span className="rdp-trail">
                          {r.table && <span className="rdp-trail__table">{r.table}</span>}
                          <span className="rdp-statechip" style={{ color: stateById(r.status).fill }}>
                            <Icon name={stateById(r.status).icon} size={20} />
                            <span className="rd-sr">{stateById(r.status).label}</span>
                          </span>
                        </span>
                      </button>
                    ))}
                  </section>
                ))}
              </div>

              <div className="rdp-dock" role="group" aria-label="Service tools">
                {IPAD.dock.map((d) => (
                  <button key={d.icon} type="button" className="rdp-dockbtn" aria-label={d.label}>
                    <Icon name={d.icon} size={20} />
                    {d.badge ? (
                      <span className="rdp-badge">
                        {d.badge}
                        <span className="rd-sr"> unread</span>
                      </span>
                    ) : null}
                    {d.dot ? <span className="rdp-newdot" aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
            </aside>

            {/* The record. Same zones and the same classes as the phone. */}
            <main className="rdp-main">
              <div className="rdp-facts rd-zone" style={zone(0)}>
                <span className="rdp-fact">
                  <Icon name="clock" size={16} />
                  {RESERVATION.time}
                </span>
                <span className="rdp-fact">
                  <Icon name="person" size={16} />
                  {RESERVATION.partySize}
                </span>
                <span className="rdp-fact">
                  <Icon name="seat" size={16} />
                  2h 0m
                </span>
              </div>

              <div className="rd-row rd-row--guest rd-zone" style={zone(1)}>
                <span className="rd-avatar" aria-hidden="true">
                  {RESERVATION.initials}
                </span>
                <h3 className="rd-reset rd-guest">{RESERVATION.guest}</h3>
                <button type="button" className="rd-iconbtn">
                  <Icon name="edit" size={16} />
                  <span className="rd-sr">Edit guest</span>
                </button>
              </div>

              <button type="button" className="rd-row rd-row--action rd-row--tags rd-zone" style={zone(2)}>
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

              {/* Every section is present and scrolled, exactly as on the phone —
                  the strip is a scroll anchor, not a panel switch. The tablet's
                  contribution is that the identity zones above stay put while the
                  notes move under them, so the record you are annotating never
                  leaves the screen. Same control, same sections, more room. */}
              <div
                className="rdp-notes rd-zone"
                style={zone(3)}
                ref={scrollRef}
                onScroll={onScroll}
                tabIndex={0}
                role="group"
                aria-label={`Notes and history for ${RESERVATION.guest}`}
              >
                <SelectStrip
                  mode="nav"
                  sticky
                  stuck={stuck}
                  ariaLabel="Jump to note section"
                  stripRef={stripRef}
                  itemRefs={tabRefs}
                  onKeyDown={onStripKeyDown}
                  active={active}
                  onSelect={goToSection}
                  items={NOTE_SECTIONS.map((sc) => ({
                    id: sc.id,
                    label: sc.label,
                    content: <Icon name={sc.icon} size={24} />,
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
                      className={`rd-section${isHistory ? " rd-section--history" : ""}`}
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
                            items={SCOPES.map((sc) => ({
                              id: sc.id,
                              label: sc.label,
                              content: <span aria-hidden="true">{sc.label}</span>,
                            }))}
                            itemAttrs={(i2) => ({
                              role: "tab",
                              id: `${baseId}-scope-${SCOPES[i2].id}`,
                              "aria-selected": i2 === scope,
                              "aria-controls": `${baseId}-visits`,
                            })}
                          />
                          <div
                            className="rd-visits"
                            id={`${baseId}-visits`}
                            role="tabpanel"
                            aria-labelledby={`${baseId}-scope-${SCOPES[scope].id}`}
                            tabIndex={-1}
                          >
                            {SCOPES[scope].visits.map((visit) => (
                              <div key={visit.id} className="rd-visit">
                                <h4 className="rd-reset rd-visit__heading">{visit.heading}</h4>
                                {visit.events.map((event) => (
                                  <div key={event.id} className="rd-event">
                                    <Icon name={event.icon} size={16} />
                                    <span className="rd-event__time">{event.time}</span>
                                    <div className="rd-event__body">
                                      <p className="rd-reset rd-event__text">{event.text}</p>
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
                        </>
                      ) : section.notes?.length ? (
                        section.notes.map((n) => (
                          <button type="button" key={n.id} className="rd-row rd-row--action rd-row--note">
                            <span className="rd-note">
                              <span className="rd-notetext">{n.text}</span>
                              <span className="rd-noteby">
                                {n.author} · {n.date}
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
            </main>

            {/* Zones that sit UNDER the record on the phone sit beside it here,
                as a properties rail: one status control, then the reservation's
                actions as full-width rows with a leading glyph. Two carry the
                thing they would actually send on a second line, because "Send"
                and "Re-send" are not distinguishable without it. */}
            <aside className="rdp-side" aria-label="Reservation actions">
              <button
                type="button"
                className="rdp-status"
                style={{ background: recordState.fill, color: recordState.on }}
              >
                <Icon name={recordState.icon} size={20} />
                <span className="rdp-status__label">{recordState.label}</span>
                <Icon name="chevron-right" size={20} className="rdp-status__chev" />
              </button>

              <div className="rdp-actions">
                {IPAD.actions.map((act) => (
                  <button key={act.id} type="button" className="rdp-act">
                    <Icon name={act.icon} size={20} />
                    <span className="rdp-act__body">
                      <b>{act.label}</b>
                      {act.sub && <i>{act.sub}</i>}
                    </span>
                  </button>
                ))}

                {/* A readout, not an action — it discloses the bill rather than
                    performing anything, so it is styled apart from the rows
                    above and carries the amount in the label, never in colour. */}
                <button type="button" className="rdp-act rdp-act--danger">
                  <Icon name="price" size={20} />
                  <span className="rdp-act__body">
                    <b>
                      {IPAD.balance.label} · {IPAD.balance.amount}
                    </b>
                  </span>
                  <Icon name="chevron-right" size={20} className="rdp-act__chev" />
                </button>

                <div className="rdp-order">
                  <button type="button" className="rdp-act rdp-act--order">
                    <Icon name="utensils" size={20} />
                    <span className="rdp-act__body">
                      <b>
                        {IPAD.order.qty} {IPAD.order.label}
                      </b>
                    </span>
                    <Icon name="chevron-right" size={20} className="rdp-act__chev" />
                  </button>
                  <ul className="rd-reset rdp-order__items">
                    {IPAD.order.items.map((it) => (
                      <li key={it} className="rd-reset">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rd-row rd-row--switch rdp-sideRow">
                  <label className="rd-switch" htmlFor="rdp-pacing">
                    <span className="rd-switch__label">Exclude party from pacing limit</span>
                    <input
                      id="rdp-pacing"
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

                <button type="button" className="rd-row rd-row--action rd-row--referral rdp-sideRow">
                  <Icon name="plus" size={20} />
                  <span className="rd-referral">Add a referral</span>
                  <Icon name="chevron-right" size={20} className="rd-chevron" />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
