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

import { useState } from "react";
import { Icon, SelectStrip } from "./ReservationDetailDemo";
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

const SCOPES: { id: string; label: string; visits: Visit[] }[] = [
  { id: "current", label: "Current visit", visits: CURRENT_VISIT },
  { id: "all", label: "All visits", visits: ALL_VISITS },
];

export default function ReservationDetailIPad() {
  const [note, setNote] = useState(0);
  const [scope, setScope] = useState(0);
  const [excluded, setExcluded] = useState(false);
  const section = NOTE_SECTIONS[note];

  return (
    <div className="rr-demo rd rdp">
      <div className="rdp-device">
        <div className="rdp-screen">
          {/* Service bar — the date and shift the whole floor is working. */}
          <div className="rdp-topbar">
            <button type="button" className="rdp-icon" aria-label="Menu">
              <Icon name="menu" size={16} />
            </button>
            <span className="rdp-covers">
              <Icon name="person" size={16} />
              {IPAD.service.covers}
            </span>
            <div className="rdp-datebar">
              <button type="button" className="rdp-step" aria-label="Previous day">
                <Icon name="chevron-left" size={16} />
              </button>
              <span className="rdp-date">{IPAD.service.date}</span>
              <span className="rdp-dot" aria-hidden="true" />
              <span className="rdp-shift">{IPAD.service.shift}</span>
              <button type="button" className="rdp-step" aria-label="Next day">
                <Icon name="chevron-right" size={16} />
              </button>
            </div>
            <div className="rdp-views" role="group" aria-label="Change view">
              {["seat", "receipt", "menu"].map((v, i) => (
                <button key={v} type="button" className="rdp-icon" data-active={i === 2} aria-label={`View ${i + 1}`}>
                  <Icon name={v} size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="rdp-body">
            <nav className="rdp-rail" aria-label="Sections">
              {IPAD.rail.map((g, i) => (
                <button key={g} type="button" className="rdp-railbtn" data-active={i === 0} aria-label={`Section ${i + 1}`}>
                  <Icon name={g} size={16} />
                </button>
              ))}
              <span className="rdp-rail__spacer" />
              {IPAD.railFooter.map((g, i) => (
                <button key={g} type="button" className="rdp-railbtn" aria-label={`Utility ${i + 1}`}>
                  <Icon name={g} size={16} />
                </button>
              ))}
            </nav>

            <aside className="rdp-sidebar" aria-label="Service lists">
              <div className="rdp-listhead">
                <span>
                  <b>{IPAD.waitlist.label}</b>
                  <i>{IPAD.waitlist.sort}</i>
                </span>
                <span className="rdp-counts">
                  <Icon name="person" size={12} />
                  {IPAD.waitlist.parties}
                  <Icon name="seat" size={12} />
                  {IPAD.waitlist.covers}
                </span>
              </div>
              <div className="rdp-quotes" role="group" aria-label="Quoted wait times">
                {IPAD.waitTimes.map((t) => (
                  <button key={t} type="button" className="rdp-quote">
                    <Icon name="seat" size={12} />
                    <span>{t}</span>
                  </button>
                ))}
                <button type="button" className="rdp-quote rdp-quote--add" aria-label="Add a quoted wait">
                  <Icon name="plus" size={12} />
                </button>
              </div>

              <div className="rdp-listhead">
                <span>
                  <b>{IPAD.reservations.label}</b>
                  <i>{IPAD.reservations.sort}</i>
                </span>
                <span className="rdp-counts">
                  <Icon name="person" size={12} />
                  {IPAD.reservations.parties}
                  <Icon name="seat" size={12} />
                  {IPAD.reservations.covers}
                </span>
              </div>
              {IPAD.list.map((r) => (
                <button key={r.id} type="button" className="rdp-resv" data-selected={r.selected}>
                  <Icon name="check" size={16} />
                  <span className="rdp-resv__size">{r.size}</span>
                  <span className="rdp-resv__body">
                    <span className="rdp-resv__time">{r.time}</span>
                    <span className="rdp-resv__name">{r.guest}</span>
                  </span>
                  <span className="rdp-resv__table">{r.table}</span>
                </button>
              ))}
            </aside>

            {/* The record. Same zones and the same classes as the phone. */}
            <main className="rdp-main">
              <div className="rdp-chips">
                <span className="rdp-chip">
                  <Icon name="clock" size={16} />
                  {RESERVATION.time}
                </span>
                <span className="rdp-chip">
                  <Icon name="person" size={16} />
                  {RESERVATION.partySize}
                </span>
                <span className="rdp-chip">
                  <Icon name="seat" size={16} />
                  2h 0m
                </span>
              </div>

              <div className="rd-row rd-row--guest">
                <span className="rd-avatar" aria-hidden="true">
                  {RESERVATION.initials}
                </span>
                <h3 className="rd-reset rd-guest">{RESERVATION.guest}</h3>
                <button type="button" className="rd-iconbtn">
                  <Icon name="edit" size={16} />
                  <span className="rd-sr">Edit guest</span>
                </button>
              </div>

              <button type="button" className="rd-row rd-row--action rd-row--tags">
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

              {/* On tablet the strip SWITCHES panels rather than scroll-spying:
                  there is room to show one category at a time without the user
                  losing their place, so it is a real tablist here. Same control,
                  different job — which is the point. */}
              <SelectStrip
                mode="tabs"
                ariaLabel="Note category"
                active={note}
                onSelect={setNote}
                items={NOTE_SECTIONS.map((sc) => ({
                  id: sc.id,
                  label: sc.label,
                  content: <Icon name={sc.icon} size={24} />,
                }))}
                itemAttrs={(i) => ({ role: "tab", "aria-selected": i === note })}
              />

              <div className="rdp-panelbody">
                {section.id === "history" ? (
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
                      itemAttrs={(i) => ({ role: "tab", "aria-selected": i === scope })}
                    />
                    <div className="rd-visits">
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
              </div>
            </main>

            {/* Zones that sit UNDER the record on the phone sit beside it here. */}
            <aside className="rdp-side" aria-label="Reservation status">
              <button type="button" className="rdp-status">
                <Icon name="check" size={16} />
                <span>{IPAD.status.label}</span>
                <Icon name="chevron-right" size={16} className="rdp-status__chev" />
              </button>
              <button type="button" className="rdp-table">
                <Icon name="seat" size={16} />
                <span className="rdp-table__body">
                  <b>{IPAD.status.table}</b>
                  <i>{IPAD.status.tableState}</i>
                </span>
              </button>
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
                <Icon name="plus" size={24} />
                <span className="rd-referral">Add a referral</span>
                <Icon name="chevron-right" size={24} className="rd-chevron" />
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
