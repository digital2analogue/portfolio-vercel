"use client";

/**
 * TableStatusDemo — a live recreation of OpenTable's OTKit
 * `.iOS-tile-reservation/parts/table status` tiles, embedded in the OTKit case
 * study as the floor-plan counterpart to the reservation-status demo.
 *
 * It's a contrast *audit*: a floor of table tiles (table number + course icon),
 * each filled by a semantic OTKit token, its label using that background's own
 * `foreground/on-<token>` color. Toggle "Before (as designed)" to see the four
 * tiles whose on-token is white on a fill too light for it — the three drinks
 * tiles (accent-lime, 1.99:1) and course 4 (accent-teal, 3.24:1). "After"
 * repairs them per the token system: drinks fall back to foreground-default,
 * course 4's fill is darkened. Select any tile to inspect its tokens + ratio.
 *
 * Source: Figma node 15832:1266 (see lib/tableStatus.ts). Icons are redrawn to
 * match the OTKit glyphs (the source vectors sit behind an egress-blocked CDN in
 * this environment). Default mode is the repaired (AA-passing) state so the page
 * loads clean. Keyboard-operable, aria-live summary, prefers-reduced-motion.
 */

import { useState } from "react";
import {
  TILES,
  TILE_COUNT,
  failingIds,
  variantFor,
  ratioFor,
  passesAA,
  type AuditMode,
  type Tile,
} from "@/lib/tableStatus";

const ICONS: Record<string, React.ReactNode> = {
  // Seating progression
  seated: <><rect x="6" y="3.5" width="8" height="6.5" rx="1.5" /><path d="M4.5 10.5h11" /><path d="M6 11v3.5M14 11v3.5" /></>,
  partial: <><circle cx="7" cy="9" r="3" fill="currentColor" stroke="none" /><circle cx="13.5" cy="9" r="3" /><path d="M4 15h12" /></>,
  // Courses (named)
  appetizer: <><path d="M3.5 9.5a6.5 6.5 0 0 0 13 0z" /><path d="M8.5 4v2.6M11.5 4v2.6" /></>,
  entree: <><path d="M4 13a6 6 0 0 1 12 0z" /><path d="M3 13.5h14" /><circle cx="10" cy="6.4" r="0.9" fill="currentColor" stroke="none" /></>,
  dessert: <><path d="M5.5 9h9l-1 6.5h-7z" /><path d="M5 9a5 5 0 0 1 10 0" /><circle cx="10" cy="4" r="1" fill="currentColor" stroke="none" /></>,
  sorbet: <><path d="M6.5 8.5L10 16.5l3.5-8" /><circle cx="8.4" cy="7.6" r="2.2" /><circle cx="11.6" cy="7.6" r="2.2" /></>,
  cleared: <><ellipse cx="10" cy="7.5" rx="6" ry="1.8" /><ellipse cx="10" cy="11.5" rx="6" ry="1.8" /><ellipse cx="10" cy="15" rx="5.4" ry="1.6" /></>,
  receipt: <><path d="M5 3.5h10v13l-2-1.3-1.7 1.3-1.3-1.3-1.3 1.3-1.7-1.3-2 1.3z" /><path d="M7.5 7h5M7.5 10h5" /></>,
  price: <><rect x="3" y="6" width="14" height="8" rx="1.5" /><circle cx="10" cy="10" r="2" /><path d="M6 8.2v3.6M14 8.2v3.6" /></>,
  bussing: <><path d="M14.5 3.5 8.5 9.5" /><path d="M8.5 9.5 4.5 13.5 7 16 11 12z" /><path d="M5.6 14 8.1 16.5M7 12.6 9.5 15M8.4 11.2 10.9 13.7" /></>,
  // Drinks
  drinks: <><path d="M6.5 3.5h7l-.7 4.2a3 3 0 0 1-5.6 0z" /><path d="M10 11.4v4.1M7 15.5h6" /></>,
  cocktail: <><path d="M4 4.5h12l-6 6.5z" /><path d="M10 11v4.5M7 15.5h6" /><circle cx="12.8" cy="6" r="0.8" fill="currentColor" stroke="none" /></>,
  bottle: <><path d="M8.5 3h3v2l1 2.5v9h-5v-9l1-2.5z" /><path d="M8 8.5h4" /></>,
  chef: <><path d="M6 11a2.7 2.7 0 1 1 1.2-5.2 3 3 0 0 1 5.6 0A2.7 2.7 0 1 1 14 11z" /><path d="M6.5 11h7v3.6a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z" /></>,
  flag: <><path d="M5 3v14" /><path d="M5 3.5h9l-2 3 2 3H5z" /></>,
};

function TileGlyph({ icon }: { icon: string }) {
  const course = /^c([1-6])$/.exec(icon);
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {course ? (
        <>
          <circle cx="10" cy="10" r="7.5" />
          <text x="10" y="10.5" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="600" fill="currentColor" stroke="none">{course[1]}</text>
        </>
      ) : (
        ICONS[icon] ?? ICONS.seated
      )}
    </svg>
  );
}

export default function TableStatusDemo() {
  const [mode, setMode] = useState<AuditMode>("repaired");
  const [selected, setSelected] = useState<Tile | null>(null);

  const failCount = failingIds.length;
  const summary =
    mode === "designed"
      ? `${failCount} of ${TILE_COUNT} tiles fail WCAG AA — the on-token is white on a fill too light for it.`
      : `All ${TILE_COUNT} tiles pass WCAG AA — each label uses its background's on-token (with a fallback where white failed).`;

  const tile = selected;
  const tv = tile ? variantFor(tile, mode) : null;

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
          const v = variantFor(t, mode);
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
              aria-label={`Table 34, ${t.label}. Background ${t.fillToken}, label ${v.onToken}. Contrast ${ratio.toFixed(2)} to 1, ${pass ? "passes" : "fails"} AA.`}
              style={{ ["--fill" as string]: v.fill, ["--on" as string]: v.on }}
              title={`${t.label} · ${t.fillToken} · ${ratio.toFixed(2)}:1`}
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
        {tile && tv ? (
          <>
            <span className="rr-tiles-inspect__swatch" style={{ background: tv.fill, color: tv.on }}>34</span>
            <div className="rr-tiles-inspect__body">
              <div className="rr-tiles-inspect__name">{tile.label}</div>
              <div className="rr-tiles-inspect__meta">
                <code>background/{tile.fillToken}</code>
                <span> · label </span>
                <code>{tv.onToken}</code>
                <span> · </span>
                <code>{ratioFor(tile, mode).toFixed(2)}:1</code>
                <span className="rr-tiles-inspect__verdict" data-pass={passesAA(tile, mode)}>
                  {passesAA(tile, mode) ? "AA ✓" : "fails AA"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <span className="rr-tiles-inspect__hint">Select a tile to inspect its background token, label token, and live contrast ratio.</span>
        )}
      </div>

      <p className="rr-tiles-note">
        {mode === "designed"
          ? "The drinks tiles (accent-lime) and course 4 (accent-teal) bind their on-token to white — 1.99:1 and 3.24:1. On the lime fill the icon fails even the 3:1 non-text bar."
          : "Each label is its background's foreground/on-* token. Where that token is white and fails, the fix stays in-system: drinks fall back to foreground-default; course 4's fill is darkened a step. No new colors."}
      </p>
    </div>
  );
}
