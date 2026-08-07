"use client";

/**
 * BrandThemeDemo — "One component, two brands."
 *
 * The same restaurant card rendered under all three OTKit brand collections.
 * Switching brand re-points four variables; the markup, the components and the
 * other 278 tokens never change. That is the whole argument of the refresh:
 * because brand decisions were encoded as token values, a major brand shift
 * cost teams nothing.
 *
 * It doubles as the state audit behind the deck's claim that "every black-button
 * state clears WCAG AA, not just default" — and it is honest about the fact that
 * the legacy brands do NOT: white on Diner hover is 3.57:1 and on Restaurant
 * hover 3.24:1, both under the 4.5:1 text threshold. Iconic clears every state.
 *
 * The ramp states are shown as swatches with their ratio read out beside them
 * (label ink-on-white, outside the swatch), so the demo can report a failing
 * pairing without rendering one. Only the resting fills carry white text, and
 * all three of those pass — every pairing here is registered in
 * scripts/check-contrast.mjs.
 *
 * Data + WCAG math: lib/brandThemes.ts. Values are OTKit's own, read from the
 * deck's declared vector fills (see that file's header).
 */

import { useId, useState } from "react";
import {
  BRANDS,
  BRAND_TOKENS,
  RECORD,
  REPOINTED,
  SHARED_VARIABLES,
  clearsEveryState,
  stateAudit,
  type Brand,
} from "@/lib/brandThemes";

const STATE_LABEL: Record<string, string> = {
  default: "Resting",
  hover: "Hover",
  pressed: "Pressed",
};

function MichelinMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.6z" />
    </svg>
  );
}

export default function BrandThemeDemo() {
  const [brandId, setBrandId] = useState<Brand["id"]>("iconic");
  const brand = BRANDS.find((b) => b.id === brandId) ?? BRANDS[2];
  const audit = stateAudit(brand);
  const groupId = useId();

  return (
    <div
      className="rr-brand"
      style={
        {
          "--brand-default": brand.default,
          "--brand-hover": brand.hover,
          "--brand-pressed": brand.pressed,
          "--brand-alt": brand.altLight,
        } as React.CSSProperties
      }
    >
      <div className="rr-brand-head">
        <div className="rr-brand-title">Restaurant profile · one component</div>
        <div className="rr-brand-switch" role="radiogroup" aria-label="Brand collection">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={b.id === brandId}
              className="rr-brand-switch__btn"
              data-active={b.id === brandId}
              onClick={() => setBrandId(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* The card. Identical markup under every brand. */}
      <div className="rr-brand-stage">
        <article className="rr-brand-card">
          <p className="rr-brand-card__badge">
            <MichelinMark />
            {RECORD.badge}
          </p>
          <h4 className="rr-brand-card__name">{RECORD.name}</h4>
          <p className="rr-brand-card__meta">{RECORD.meta}</p>
          <div className="rr-brand-card__times">
            {RECORD.times.map((t) => (
              <span
                key={t}
                className="rr-brand-time"
                data-selected={t === RECORD.selectedTime}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="rr-brand-card__cta">Reserve for {RECORD.selectedTime} PM</p>
        </article>
      </div>

      {/* What actually changed. */}
      <div className="rr-brand-tokens">
        <p className="rr-brand-tokens__label" id={`${groupId}-diff`}>
          Brand collection · the only diff
        </p>
        <ul className="rr-brand-tokens__list" aria-labelledby={`${groupId}-diff`}>
          {BRAND_TOKENS.map(({ key, token }) => (
            <li key={token} className="rr-brand-tokens__row">
              <span
                className="rr-brand-tokens__swatch"
                style={{ background: brand[key] as string }}
                aria-hidden="true"
              />
              <code className="rr-brand-tokens__name">{token}</code>
              <code className="rr-brand-tokens__hex">{(brand[key] as string).toUpperCase()}</code>
            </li>
          ))}
        </ul>
        <p className="rr-brand-tokens__count">
          {REPOINTED} variables re-point per brand. The other {SHARED_VARIABLES} are shared.
        </p>
      </div>

      {/* The state audit — the argument for black. */}
      <div className="rr-brand-audit">
        <p className="rr-brand-audit__label">White label · action ramp</p>
        <ul className="rr-brand-audit__list">
          {audit.map((s) => (
            <li key={s.state} className="rr-brand-audit__row">
              <span
                className="rr-brand-audit__swatch"
                style={{ background: s.fill }}
                aria-hidden="true"
              />
              <span className="rr-brand-audit__state">{STATE_LABEL[s.state]}</span>
              <span className="rr-brand-audit__ratio">{s.ratio.toFixed(2)}:1</span>
              <span className="rr-brand-audit__verdict" data-pass={s.passes}>
                {s.passes ? "AA" : "FAIL"}
              </span>
            </li>
          ))}
        </ul>
        <p className="rr-brand-audit__verdict-line" aria-live="polite">
          {clearsEveryState(brand)
            ? `${brand.label} clears AA in every state.`
            : `${brand.label} clears AA at rest, but not on hover.`}
        </p>
      </div>
    </div>
  );
}
