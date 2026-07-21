"use client";

/**
 * TokensMotion — the /tokens Motion section, made to actually move.
 *
 * Instead of listing --motion-* tokens as text, this drives real motion FROM
 * the resolved token values (available at build time as `value`, e.g.
 * "cubic-bezier(0,0,0.58,1)" / "200ms"):
 *  - Duration: each row has its own track and ▶ button that darts a dot across
 *    at that token's real duration. The rows also race once, together, when the
 *    section first scrolls into view.
 *  - Easing: each curve is plotted as SVG (always visible) with its own ▶
 *    button (plus hover/focus replay) that runs a dot along that curve.
 *  - Transition composites stay as static rows — they combine the two above.
 *
 * Motion runs via the Web Animations API. Ambient playback (scroll-in autoplay,
 * hover replay) is gated behind prefers-reduced-motion; an explicit ▶ press
 * always plays — deliberate user-initiated motion is the accepted exception.
 */

import { useEffect, useRef } from "react";
import { firstSentence } from "@/lib/firstSentence";

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

/**
 * Dart the dot across its track. `force` = explicit ▶ press, always plays.
 *
 * The dot RESTS at the start: it darts, holds at the end for a beat (so even a
 * 120ms dart leaves an unmissable state change), then snaps home ready to
 * replay. Without the reset, a finished dot sits at the end and the next press
 * reads as "nothing happened" for the short durations.
 */
const HOLD_MS = 1100;

const runDot = (
  el: HTMLSpanElement | null,
  duration: number,
  easing: string,
  force = false,
) => {
  if (!el || (!force && prefersReduced())) return;
  const track = el.parentElement;
  if (!track) return;
  const dist = track.clientWidth - el.offsetWidth;
  el.getAnimations().forEach((a) => a.cancel());
  const anim = el.animate(
    [{ transform: "translateX(0)" }, { transform: `translateX(${dist}px)` }],
    { duration, easing, fill: "forwards" },
  );
  anim.finished
    .then(() => {
      setTimeout(() => anim.cancel(), HOLD_MS); // cancel drops the fill → snaps home
    })
    .catch(() => {}); // superseded by a newer press — nothing to do
};

function PlayButton({ onPlay, name }: { onPlay: () => void; name: string }) {
  return (
    <button
      type="button"
      className="tokens-motion__play"
      onClick={onPlay}
      aria-label={`Play ${name}`}
    >
      ▶ Play
    </button>
  );
}

export default function TokensMotion({ tokens }: { tokens: Tok[] }) {
  const durations = tokens.filter((t) => t.name.startsWith("--motion-duration-"));
  const easings = tokens.filter((t) => t.name.startsWith("--motion-easing-"));
  const transitions = tokens.filter((t) => t.name.startsWith("--motion-transition-"));

  const durDots = useRef<(HTMLSpanElement | null)[]>([]);
  const durSection = useRef<HTMLDivElement>(null);

  // Race all duration rows once when the section first scrolls into view, so
  // the relative timing (instant finishes first, emphasized last) is visible.
  useEffect(() => {
    const node = durSection.current;
    if (!node || prefersReduced() || typeof IntersectionObserver === "undefined") return;
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played) {
            played = true;
            durations.forEach((d, i) => runDot(durDots.current[i], parseMs(d.value), "linear"));
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
        Two registers, one token set: <strong>productive</strong> motion for UI
        that responds; <strong>expressive</strong> motion for layer-shifting
        moments.
      </p>

      {/* ── Duration ── */}
      <div className="tokens-motion__sublabel">
        <span>Duration</span>
        <span className="tokens-motion__hint">real time — instant is over in a blink by design</span>
      </div>
      <div className="tokens-motion__durations" ref={durSection}>
        {durations.map((d, i) => (
          <div key={d.name} className="tokens-motion__drow">
            <div className="tokens-motion__meta">
              <code className="tokens-row__token">{d.name}</code>
              <code className="tokens-row__value">{d.value}</code>
              <span className="tokens-row__role">{firstSentence(d.description)}</span>
            </div>
            <div className="tokens-motion__anim">
              <div className="tokens-motion__track" aria-hidden="true">
                <span
                  className="tokens-motion__dot"
                  ref={(el) => {
                    durDots.current[i] = el;
                  }}
                />
              </div>
              <PlayButton
                name={label(d.name, "--motion-duration-")}
                onPlay={() => runDot(durDots.current[i], parseMs(d.value), "linear", true)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Easing ── */}
      <div className="tokens-motion__sublabel">
        <span>Easing</span>
        <span className="tokens-motion__hint">same distance, same time — only the curve changes</span>
      </div>
      <div className="tokens-motion__easings">
        {easings.map((e) => {
          const path = curvePath(e.value, CURVE, 8);
          const dotRef = { current: null as HTMLSpanElement | null };
          const replay = (force = false) => runDot(dotRef.current, 900, e.value, force);
          return (
            <div
              key={e.name}
              className="tokens-motion__erow"
              onMouseEnter={() => replay()}
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
                <span className="tokens-row__role">{firstSentence(e.description)}</span>
              </div>
              <div className="tokens-motion__anim">
                <div className="tokens-motion__track" aria-hidden="true">
                  <span
                    className="tokens-motion__dot"
                    ref={(el) => {
                      dotRef.current = el;
                    }}
                  />
                </div>
                <PlayButton
                  name={`${label(e.name, "--motion-easing-")} easing`}
                  onPlay={() => replay(true)}
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
                <div className="tokens-row__role">{firstSentence(t.description)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
