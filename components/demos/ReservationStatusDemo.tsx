"use client";

/**
 * ReservationStatusDemo — a live, faithful recreation of OpenTable's OTKit
 * `web-button/reservation-states` component, embedded in the OTKit case study.
 *
 * It makes the case's "Table Statuses" argument interactive: 22 reservation
 * states, each mapped onto one of 11 semantic OTKit tokens. Visitors advance a
 * reservation through its real service lifecycle (productive motion: rest →
 * hover → active → loading → settle), jump to any state, and toggle the
 * "palette lens" to watch 21 ad-hoc colors collapse onto the semantic system.
 *
 * Faithful to the Figma source (variant names, fills, radius, type) with two
 * fills nudged to clear WCAG AA — see lib/reservationStates.ts. Light-mode by
 * design; the surrounding .demo-frame frames it as a product surface inside the
 * dark portfolio. Keyboard-operable, announces state changes via aria-live, and
 * honors prefers-reduced-motion (all timing/animation is CSS-gated).
 */

import { useCallback, useId, useRef, useState } from "react";
import {
  LIFECYCLE,
  ALL_STATES,
  SEMANTIC_PALETTE,
  STATE_COUNT,
  TOKEN_COUNT,
  type ReservationState,
} from "@/lib/reservationStates";

const ICONS: Record<string, React.ReactNode> = {
  menu: <><line x1="4" y1="6" x2="16" y2="6" /><line x1="4" y1="10" x2="16" y2="10" /><line x1="4" y1="14" x2="16" y2="14" /></>,
  check: <polyline points="4 10.5 8.5 15 16 5.5" />,
  clock: <><circle cx="10" cy="10" r="6.5" /><polyline points="10 6.5 10 10 12.5 11.5" /></>,
  arrived: <><polyline points="3 10 11 10" /><polyline points="8 6.5 11.5 10 8 13.5" /><line x1="15" y1="4" x2="15" y2="16" /></>,
  partial: <><circle cx="10" cy="10" r="6.5" /><path d="M10 3.5 A6.5 6.5 0 0 1 10 16.5 Z" fill="currentColor" stroke="none" /></>,
  seat: <><path d="M5 4v6h10V4" /><line x1="5" y1="10" x2="5" y2="16" /><line x1="15" y1="10" x2="15" y2="16" /><line x1="4" y1="10" x2="16" y2="10" /></>,
  plate: <><line x1="6" y1="3.5" x2="6" y2="16.5" /><path d="M13.5 3.5v5a1.5 1.5 0 0 1-3 0v-5" /><line x1="12" y1="3.5" x2="12" y2="16.5" /></>,
  clear: <><rect x="4" y="4" width="12" height="4" rx="1" /><rect x="4" y="11" width="12" height="4" rx="1" /></>,
  receipt: <><path d="M5 3.5h10v13l-2-1.3-1.7 1.3-1.3-1.3-1.3 1.3-1.7-1.3-2 1.3z" /><line x1="7.5" y1="7" x2="12.5" y2="7" /><line x1="7.5" y1="10" x2="12.5" y2="10" /></>,
  broom: <><line x1="14" y1="4" x2="8" y2="10" /><path d="M8 10l-3.5 3.5a2 2 0 0 0 0 2.8h2.8L11 12.8z" /></>,
  price: <><path d="M10.5 3.5H16V9l-6.5 6.5a1.5 1.5 0 0 1-2.1 0L3.5 11.6a1.5 1.5 0 0 1 0-2.1z" /><circle cx="12.5" cy="7" r="1" /></>,
  message: <><path d="M4 5h12v8H9l-3.5 2.5V13H4z" /></>,
  nav: <polygon points="16 4 4 9.5 9 11 11 16" />,
  x: <><line x1="5.5" y1="5.5" x2="14.5" y2="14.5" /><line x1="14.5" y1="5.5" x2="5.5" y2="14.5" /></>,
};

function StateIcon({ name }: { name: string }) {
  return (
    <svg className="rr-demo-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] ?? ICONS.menu}
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="rr-demo-spinner" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M10 2.5 A7.5 7.5 0 0 1 17.5 10" />
    </svg>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function ReservationStatusDemo() {
  const [current, setCurrent] = useState<ReservationState>(LIFECYCLE[0]);
  const [advancing, setAdvancing] = useState(false);
  const [lens, setLens] = useState<"adhoc" | "semantic">("semantic");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectId = useId();

  const lifeIndex = LIFECYCLE.findIndex((s) => s.id === current.id);
  const canAdvance = lifeIndex >= 0 && lifeIndex < LIFECYCLE.length - 1;

  const settle = useCallback((next: ReservationState) => {
    setCurrent(next);
    setAdvancing(false);
  }, []);

  const advance = useCallback(() => {
    if (!canAdvance || advancing) return;
    const next = LIFECYCLE[lifeIndex + 1];
    if (prefersReducedMotion()) {
      settle(next);
      return;
    }
    // Productive-motion beat: a brief loading state simulating the server write
    // that the real host UI performs when a server taps the status.
    setAdvancing(true);
    timer.current = setTimeout(() => settle(next), 460);
  }, [canAdvance, advancing, lifeIndex, settle]);

  const jump = (id: string) => {
    if (timer.current) clearTimeout(timer.current);
    const found = ALL_STATES.find((s) => s.id === id);
    if (found) {
      setAdvancing(false);
      setCurrent(found);
    }
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setAdvancing(false);
    setCurrent(LIFECYCLE[0]);
  };

  const announce = current.sublabel
    ? `${current.label}, ${current.sublabel}`
    : current.label;

  return (
    <div className="rr-demo" data-lens={lens}>
      {/* ── Product surface: a single reservation on the floor view ── */}
      <div className="rr-demo-surface">
        <div className="rr-demo-reso">
          <div className="rr-demo-reso__avatar" aria-hidden="true">RB</div>
          <div className="rr-demo-reso__meta">
            <span className="rr-demo-reso__name">Blumenthal, party of 4</span>
            <span className="rr-demo-reso__sub">7:30 PM · Table 12 · Window</span>
          </div>
        </div>

        {/* The real component: reservation-status button */}
        <button
          type="button"
          className="rr-status"
          data-variant={current.variant}
          onClick={advance}
          disabled={advancing}
          aria-busy={advancing}
          aria-label={
            canAdvance
              ? `Reservation status: ${announce}. Activate to advance service.`
              : `Reservation status: ${announce}.`
          }
          style={{ ["--fill" as string]: current.fill, ["--on" as string]: current.on }}
        >
          <span className="rr-status__icon">
            {advancing ? <Spinner /> : <StateIcon name={current.icon} />}
          </span>
          <span className="rr-status__label">
            {current.label}
            {current.sublabel && <span className="rr-status__sub">{current.sublabel}</span>}
          </span>
          <svg className="rr-status__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="4 6 8 10 12 6" />
          </svg>
        </button>
      </div>

      {/* ── Controls ── */}
      <div className="rr-demo-controls">
        <button type="button" className="rr-demo-btn rr-demo-btn--primary" onClick={advance} disabled={!canAdvance || advancing}>
          {canAdvance ? "Advance service →" : "Service complete"}
        </button>

        <div className="rr-demo-field">
          <label htmlFor={selectId} className="rr-demo-field__label">Jump to state</label>
          <select id={selectId} className="rr-demo-select" value={current.id} onChange={(e) => jump(e.target.value)}>
            <optgroup label="Lifecycle">
              {LIFECYCLE.map((s) => (
                <option key={s.id} value={s.id}>{s.label}{s.sublabel ? ` — ${s.sublabel}` : ""}</option>
              ))}
            </optgroup>
            <optgroup label="Branch states">
              {ALL_STATES.filter((s) => !LIFECYCLE.includes(s)).map((s) => (
                <option key={s.id} value={s.id}>{s.label}{s.sublabel ? ` — ${s.sublabel}` : ""}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <button type="button" className="rr-demo-btn" onClick={reset}>Reset</button>
      </div>

      {/* Screen-reader announcement of the current status */}
      <p className="rr-demo-sr" aria-live="polite">Reservation status: {announce}</p>

      {/* ── Palette lens: the before/after governance story ── */}
      <div className="rr-demo-lens">
        <div className="rr-demo-lens__head">
          <div className="rr-demo-lens__title">
            {lens === "semantic"
              ? `${STATE_COUNT} states → ${TOKEN_COUNT} semantic tokens`
              : `${STATE_COUNT} states → 21 one-off colors`}
          </div>
          <div className="rr-demo-lens__toggle" role="radiogroup" aria-label="Color palette lens">
            <button type="button" role="radio" aria-checked={lens === "adhoc"} className="rr-demo-seg" data-active={lens === "adhoc"} onClick={() => setLens("adhoc")}>Ad-hoc</button>
            <button type="button" role="radio" aria-checked={lens === "semantic"} className="rr-demo-seg" data-active={lens === "semantic"} onClick={() => setLens("semantic")}>Semantic</button>
          </div>
        </div>

        <div className="rr-demo-swatches">
          {ALL_STATES.map((s) => (
            <span
              key={s.id}
              className="rr-demo-swatch"
              data-current={s.id === current.id}
              style={{ ["--c" as string]: lens === "semantic" ? s.fill : s.sprawl }}
              title={lens === "semantic" ? `${s.label} · ${s.tokenLabel}` : `${s.label} · one-off`}
            >
              <span className="rr-demo-swatch__dot" />
              <span className="rr-demo-swatch__name">{s.label}</span>
            </span>
          ))}
        </div>

        <div className="rr-demo-legend" aria-hidden={lens !== "semantic"} data-visible={lens === "semantic"}>
          {SEMANTIC_PALETTE.map((t) => (
            <span key={t.token} className="rr-demo-legend__item">
              <span className="rr-demo-legend__dot" style={{ background: t.fill, borderColor: t.fill === "#ffffff" ? "#d8d9db" : t.fill }} />
              <span className="rr-demo-legend__name">{t.label}</span>
              <span className="rr-demo-legend__count">×{t.count}</span>
            </span>
          ))}
        </div>

        <p className="rr-demo-lens__note">
          {lens === "semantic"
            ? "Every reservation state resolves to an existing OTKit token — no new color enters the system."
            : "The original proposal: a distinct color per state. Visually noisy, unmaintainable, and impossible to theme."}
        </p>
      </div>
    </div>
  );
}
