"use client";

/**
 * TableStatusDemo — a live, faithful recreation of OpenTable's OTKit
 * `.iOS-tile-reservation/parts/table status` tiles, embedded in the OTKit case
 * study as the floor-plan counterpart to the reservation-status demo.
 *
 * It's a contrast *audit*: a floor of table tiles (table number + course icon),
 * each filled by a semantic OTKit token. Toggle "Before (as designed)" to see
 * the four tiles whose white label was bound to a fill too light for it —
 * course 4 (teal, 3.24:1) and the three drinks tiles (lime, 1.99:1) — flagged
 * as failing WCAG AA. "After (AA-repaired)" applies the token system's own rule
 * (light fills pair with ink) so every tile passes. Select any tile to inspect
 * its token, fill, label color, and live contrast ratio.
 *
 * Source: Figma node 15832:1266 (see lib/tableStatus.ts). Light-mode by design;
 * default mode is the repaired (AA-passing) state so the page loads clean, with
 * the failures shown only when the viewer opts into "Before". Keyboard-operable,
 * aria-live audit summary, all animation CSS-gated behind prefers-reduced-motion.
 */

import { useId, useState } from "react";
import {
  TILES,
  TILE_COUNT,
  failingIds,
  onColor,
  ratioFor,
  passesAA,
  type AuditMode,
  type Tile,
} from "@/lib/tableStatus";

const ICONS: Record<string, React.ReactNode> = {
  seat: <><path d="M5 4v6h10V4" /><line x1="5" y1="10" x2="5" y2="16" /><line x1="15" y1="10" x2="15" y2="16" /><line x1="4" y1="10" x2="16" y2="10" /></>,
  partial: <><circle cx="10" cy="10" r="6.5" /><path d="M10 3.5 A6.5 6.5 0 0 1 10 16.5 Z" fill="currentColor" stroke="none" /></>,
  plate: <><line x1="6" y1="3.5" x2="6" y2="16.5" /><path d="M13.5 3.5v5a1.5 1.5 0 0 1-3 0v-5" /><line x1="12" y1="3.5" x2="12" y2="16.5" /></>,
  dessert: <><path d="M6 8h8l-4 8.5z" /><path d="M6 8a4 4 0 0 1 8 0" /></>,
  clear: <><rect x="4" y="4" width="12" height="4" rx="1" /><rect x="4" y="11" width="12" height="4" rx="1" /></>,
  receipt: <><path d="M5 3.5h10v13l-2-1.3-1.7 1.3-1.3-1.3-1.3 1.3-1.7-1.3-2 1.3z" /><line x1="7.5" y1="7" x2="12.5" y2="7" /><line x1="7.5" y1="10" x2="12.5" y2="10" /></>,
  price: <><path d="M10.5 3.5H16V9l-6.5 6.5a1.5 1.5 0 0 1-2.1 0L3.5 11.6a1.5 1.5 0 0 1 0-2.1z" /><circle cx="12.5" cy="7" r="1" /></>,
  broom: <><line x1="14" y1="4" x2="8" y2="10" /><path d="M8 10l-3.5 3.5a2 2 0 0 0 0 2.8h2.8L11 12.8z" /></>,
  wine: <><path d="M6.5 3.5h7l-.6 4a3 3 0 0 1-5.8 0z" /><line x1="10" y1="11" x2="10" y2="16.5" /><line x1="7" y1="16.5" x2="13" y2="16.5" /></>,
  cocktail: <><path d="M4 4h12l-6 6.5z" /><line x1="10" y1="10.5" x2="10" y2="16.5" /><line x1="7" y1="16.5" x2="13" y2="16.5" /></>,
  bottle: <><path d="M8.5 3.5h3v2.5l1 2v9h-5v-9l1-2z" /><line x1="8" y1="10" x2="12" y2="10" /></>,
  chef: <><path d="M6 11a3 3 0 1 1 1.2-5.75A3 3 0 0 1 12.8 5.25 3 3 0 1 1 14 11z" /><line x1="6" y1="11" x2="14" y2="15.5" /><path d="M6 11v3.5h8V11" /></>,
  flag: <><line x1="5" y1="3" x2="5" y2="17" /><path d="M5 4h9l-2 3 2 3H5z" /></>,
};

function TileGlyph({ icon }: { icon: string }) {
  const course = /^c([1-6])$/.exec(icon);
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {course ? (
        <>
          <circle cx="10" cy="10" r="7.5" />
          <text x="10" y="10" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="600" fill="currentColor" stroke="none">{course[1]}</text>
        </>
      ) : (
        ICONS[icon] ?? ICONS.seat
      )}
    </svg>
  );
}

export default function TableStatusDemo() {
  const [mode, setMode] = useState<AuditMode>("repaired");
  const [selected, setSelected] = useState<Tile | null>(null);
  const baseId = useId();

  const failCount = failingIds.length;
  const summary =
    mode === "designed"
      ? `${failCount} of ${TILE_COUNT} tiles fail WCAG AA — the label sits on a fill too light for it.`
      : `All ${TILE_COUNT} tiles pass WCAG AA — light fills bound to ink, per the token system.`;

  const tile = selected;

  return (
    <div className="rr-tiles" data-mode={mode}>
      {/* ── Audit header ── */}
      <div className="rr-tiles-head">
        <div className="rr-tiles-title">Floor plan — table status</div>
        <div className="rr-tiles-toggle" role="radiogroup" aria-label="Contrast audit view">
          <button type="button" role="radio" aria-checked={mode === "designed"} className="rr-demo-seg" data-active={mode === "designed"} onClick={() => setMode("designed")}>Before</button>
          <button type="button" role="radio" aria-checked={mode === "repaired"} className="rr-demo-seg" data-active={mode === "repaired"} onClick={() => setMode("repaired")}>After</button>
        </div>
      </div>

      {/* ── Tile floor ── */}
      <div className="rr-tiles-grid" role="list">
        {TILES.map((t) => {
          const on = onColor(t, mode);
          const ratio = ratioFor(t, mode);
          const pass = passesAA(t, mode);
          return (
            <button
              key={t.id}
              type="button"
              role="listitem"
              className="rr-tile"
              data-fail={!pass}
              data-selected={selected?.id === t.id}
              onClick={() => setSelected(t)}
              onMouseEnter={() => setSelected(t)}
              onFocus={() => setSelected(t)}
              aria-label={`Table 34, ${t.label}. Token ${t.token}. Label contrast ${ratio.toFixed(2)} to 1, ${pass ? "passes" : "fails"} AA.`}
              style={{ ["--fill" as string]: t.fill, ["--on" as string]: on }}
              title={`${t.label} · ${t.token} · ${ratio.toFixed(2)}:1`}
            >
              <span className="rr-tile__num">34</span>
              <span className="rr-tile__glyph"><TileGlyph icon={t.icon} /></span>
              {!pass && <span className="rr-tile__warn" aria-hidden="true">!</span>}
            </button>
          );
        })}
      </div>

      {/* ── Summary + inspector ── */}
      <p className="rr-tiles-summary" data-fail={mode === "designed" && failCount > 0} aria-live="polite">{summary}</p>

      <div className="rr-tiles-inspect">
        {tile ? (
          <>
            <span className="rr-tiles-inspect__swatch" style={{ background: tile.fill, color: onColor(tile, mode) }}>34</span>
            <div className="rr-tiles-inspect__body">
              <div className="rr-tiles-inspect__name">{tile.label}</div>
              <div className="rr-tiles-inspect__meta">
                <code>background/{tile.token}</code>
                <span> · label </span>
                <code>{onColor(tile, mode) === "#141a26" || onColor(tile, mode) === "#2d333f" ? "ink" : "white"}</code>
                <span> · </span>
                <code>{ratioFor(tile, mode).toFixed(2)}:1</code>
                <span className="rr-tiles-inspect__verdict" data-pass={passesAA(tile, mode)}>
                  {passesAA(tile, mode) ? "AA ✓" : "fails AA"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <span className="rr-tiles-inspect__hint">Select a tile to inspect its token, label color, and live contrast ratio.</span>
        )}
      </div>

      <p className="rr-tiles-note">
        {mode === "designed"
          ? "The drinks tiles (lime #ABC31B) and course 4 (teal #2B9ABF) were bound to a white label — 1.99:1 and 3.24:1. The icon on the lime fill fails even the 3:1 non-text bar."
          : "The repair follows the system's own convention: fills lighter than the white-label threshold pair with ink (foreground/on-*-secondary) — no new colors, just the correct pairing."}
        <span id={`${baseId}-sr`} />
      </p>
    </div>
  );
}
