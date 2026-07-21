"use client";

/**
 * TokensMotion — the /tokens Motion section, made to actually move.
 *
 * Instead of listing --motion-* tokens as text, this drives real motion FROM
 * the resolved token values (available at build time as `value`, e.g.
 * "cubic-bezier(0,0,0.58,1)" / "200ms"):
 *  - Duration: three dots race the same track, each timed by its token, so you
 *    see instant finish first and emphasized last. Plays on a button and once
 *    when the section scrolls into view.
 *  - Easing: each curve is plotted as SVG (always visible) and a dot replays
 *    that curve on hover / focus / click, so you feel enter vs exit vs move.
 *  - Transition composites stay as static rows — they combine the two above.
 *
 * All motion is driven via the Web Animations API from the token values and is
 * gated behind prefers-reduced-motion (curves + values stay; nothing moves).
 */

import { useEffect, useRef } from "react";

type Tok = { name: string; value: string; description: string };

const label = (name: string, prefix: string) =>
  name.slice(prefix.length).replace(/-/g, " ");

const parseMs = (v: string) => {
  const m = v.match(/([\d.]+)\s*ms/);
  if (m) return parseFloat(m[1]);
  const s = v.match(/([\d.]+)\s*s/);
  return s ? parseFloat(s[1]) * 1000 : 300;
};

// SVG path for a cubic-bezier(x1,y1,x2,y2) curve, y-inverted into a padded box.
function curvePath(value: string, size: number, pad: number): string | null {
  const m = value.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return null;
  const [x1, y1, x2, y2] = m[1].split(",").map((n) => parseFloat(n));
  const X = (v: number) => pad + v * (size - 2 * pad);
  const Y = (v: number) => size - pad - v * (size - 2 * pad);
  return `M ${X(0)} ${Y(0)} C ${X(x1)} ${Y(y1)}, ${X(x2)} ${Y(y2)}, ${X(1)} ${Y(1)}`;
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function TokensMotion({ tokens }: { tokens: Tok[] }) {
  const durations = tokens.filter((t) => t.name.startsWith("--motion-duration-"));
  const easings = tokens.filter((t) => t.name.startsWith("--motion-easing-"));
  const transitions = tokens.filter((t) => t.name.startsWith("--motion-transition-"));

  const durDots = useRef<(HTMLSpanElement | null)[]>([]);
  const durSection = useRef<HTMLDivElement>(null);

  const runDot = (el: HTMLSpanElement | null, duration: number, easing: string) => {
    if (!el || prefersReduced()) return;
    const track = el.parentElement;
    if (!track) return;
    const dist = track.clientWidth - el.offsetWidth;
    el.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${dist}px)` }],
      { duration, easing, fill: "forwards" },
    );
  };

  const playDurations = () => {
    durations.forEach((d, i) => runDot(durDots.current[i], parseMs(d.value), "linear"));
  };

  // Play the duration race once when the section first scrolls into view.
  useEffect(() => {
    const node = durSection.current;
    if (!node || prefersReduced() || typeof IntersectionObserver === "undefined") return;
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played) {
            played = true;
            playDurations();
            io.disconnect();
          }
        }
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CURVE = 60;

  return (
    <div className="tokens-motion">
      <p className="tokens-motion__note">
        Two registers, from the same tokens. <strong>Productive</strong> motion —
        instant/standard durations, the enter and move curves — is for UI that
        responds: hovers, dropdowns, tab switches. <strong>Expressive</strong>{" "}
        motion — the emphasized duration — is reserved for layer-shifting moments:
        modals, drawers, route changes.
      </p>

      {/* ── Duration ── */}
      <div className="tokens-motion__sublabel">
        <span>Duration</span>
        <button type="button" className="tokens-motion__play" onClick={playDurations}>
          ▶ Play
        </button>
      </div>
      <div className="tokens-motion__durations" ref={durSection}>
        {durations.map((d, i) => (
          <div key={d.name} className="tokens-motion__drow">
            <div className="tokens-motion__meta">
              <code className="tokens-row__token">{d.name}</code>
              <code className="tokens-row__value">{d.value}</code>
              <span className="tokens-row__role">{d.description}</span>
            </div>
            <div className="tokens-motion__track" aria-hidden="true">
              <span
                className="tokens-motion__dot"
                ref={(el) => {
                  durDots.current[i] = el;
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Easing ── */}
      <div className="tokens-motion__sublabel">
        <span>Easing</span>
        <span className="tokens-motion__hint">hover a curve to replay</span>
      </div>
      <div className="tokens-motion__easings">
        {easings.map((e) => {
          const path = curvePath(e.value, CURVE, 8);
          const dotRef = { current: null as HTMLSpanElement | null };
          const replay = () => runDot(dotRef.current, 900, e.value);
          return (
            <div
              key={e.name}
              className="tokens-motion__erow"
              tabIndex={0}
              role="button"
              aria-label={`Replay ${label(e.name, "--motion-easing-")} easing`}
              onMouseEnter={replay}
              onFocus={replay}
              onClick={replay}
              onKeyDown={(e) => {
                // role="button" carries no native activation — wire it up.
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  replay();
                }
              }}
            >
              <svg
                className="tokens-motion__curve"
                width={CURVE}
                height={CURVE}
                viewBox={`0 0 ${CURVE} ${CURVE}`}
                aria-hidden="true"
              >
                <line x1="8" y1={CURVE - 8} x2={CURVE - 8} y2={CURVE - 8} className="tokens-motion__axis" />
                <line x1="8" y1="8" x2="8" y2={CURVE - 8} className="tokens-motion__axis" />
                {path ? (
                  <path d={path} className="tokens-motion__curveline" fill="none" />
                ) : (
                  <line x1="8" y1={CURVE - 8} x2={CURVE - 8} y2="8" className="tokens-motion__curveline" />
                )}
              </svg>
              <div className="tokens-motion__meta">
                <code className="tokens-row__token">{e.name}</code>
                <code className="tokens-row__value">{e.value}</code>
                <span className="tokens-row__role">{e.description}</span>
              </div>
              <div className="tokens-motion__track" aria-hidden="true">
                <span
                  className="tokens-motion__dot"
                  ref={(el) => {
                    dotRef.current = el;
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Transition composites (static) ── */}
      {transitions.length > 0 && (
        <>
          <div className="tokens-motion__sublabel">
            <span>Transition</span>
            <span className="tokens-motion__hint">duration + easing, composed</span>
          </div>
          <div className="tokens-compact">
            {transitions.map((t) => (
              <div key={t.name} className="tokens-compact__row">
                <code className="tokens-row__token">{t.name}</code>
                <code className="tokens-row__value">{t.value}</code>
                <div className="tokens-row__role">{t.description}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
