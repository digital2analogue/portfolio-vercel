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
 * Source: Figma node 15832:1266 (see lib/tableStatus.ts). Icons are the real
 * OTKit vectors (./otkitIcons, exported from the icon library), tinted via
 * currentColor per tile. Default mode is the repaired (AA-passing) state so the
 * page loads clean. Keyboard-operable, aria-live summary, prefers-reduced-motion.
 */

import { useState } from "react";
import { OTKIT_ICONS } from "./otkitIcons";
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

function TileGlyph({ icon }: { icon: string }) {
  const g = OTKIT_ICONS[icon] ?? OTKIT_ICONS.seated;
  return (
    <svg width="20" height="20" viewBox={g.viewBox} fill="currentColor" aria-hidden="true">
      {g.paths.map((p, i) => (
        <path key={i} d={p.d} fillRule={p.fillRule} clipRule={p.clipRule} />
      ))}
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
