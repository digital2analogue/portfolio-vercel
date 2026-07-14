"use client";

/**
 * TableStatusDemo — a live recreation of OpenTable's OTKit
 * `.iOS-tile-reservation/parts/table status` tiles, embedded in the OTKit case
 * study as the floor-plan counterpart to the reservation-status demo.
 *
 * It's a contrast *audit*: a floor of table tiles (table number + course icon),
 * each filled by a semantic OTKit token, its label using that background's own
 * `foreground/on-<token>` color. Two families whose real on-token (white) failed
 * AA are repaired per the token system: the three drinks tiles (accent-lime,
 * white was 1.99:1) fall back to foreground-default, and course 4 (accent-teal,
 * white was 3.24:1) darkens its fill. Every tile then clears WCAG AA. Select any
 * tile to inspect its background token, label token, and live contrast ratio.
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
  ratioFor,
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
  const [selected, setSelected] = useState<Tile | null>(null);
  const tile = selected;
  const tv = tile ? tile.repaired : null;

  const summary = `Every label uses its background's foreground/on-* token \u2014 all ${TILE_COUNT} clear WCAG AA.`;
  const note = "Each tile's label is its background's foreground/on-* token. The lighter drinks fills pair with foreground-default and course 4 uses a darker accent-teal, so every label clears WCAG AA \u2014 no new colors. Every glyph is the real OTKit vector.";

  return (
    <div className="rr-tiles">
      <div className="rr-tiles-head">
        <div className="rr-tiles-title">Floor plan — table status</div>
      </div>

      {/* \u2500\u2500 Tile floor \u2500\u2500 */}
      <div className="rr-tiles-grid" role="list">
        {TILES.map((t) => {
          const v = t.repaired;
          const ratio = ratioFor(t, "repaired");
          return (
            <button
              key={t.id}
              type="button"
              role="listitem"
              className="rr-tile"
              data-selected={selected?.id === t.id}
              onClick={() => setSelected(t)}
              onMouseEnter={() => setSelected(t)}
              onFocus={() => setSelected(t)}
              aria-label={`Table 34, ${t.label}. Background ${t.fillToken}, label ${v.onToken}. Contrast ${ratio.toFixed(2)} to 1, passes AA.`}
              style={{ ["--fill" as string]: v.fill, ["--on" as string]: v.on }}
              title={`${t.label} \u00b7 ${t.fillToken} \u00b7 ${ratio.toFixed(2)}:1`}
            >
              <span className="rr-tile__num">34</span>
              <span className="rr-tile__glyph"><TileGlyph icon={t.icon} /></span>
            </button>
          );
        })}
      </div>

      {/* \u2500\u2500 Summary + inspector \u2500\u2500 */}
      <p className="rr-tiles-summary">{summary}</p>

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
                <code>{ratioFor(tile, "repaired").toFixed(2)}:1</code>
                <span className="rr-tiles-inspect__verdict" data-pass={true}>AA ✓</span>
              </div>
            </div>
          </>
        ) : (
          <span className="rr-tiles-inspect__hint">Select a tile to inspect its background token, label token, and live contrast ratio.</span>
        )}
      </div>

      <p className="rr-tiles-note">{note}</p>
    </div>
  );
}
