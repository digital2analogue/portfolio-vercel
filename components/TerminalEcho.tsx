"use client";

/**
 * TerminalEcho — a one-line typed terminal command, the case-hero counterpart
 * to the home page's HeroTerminal boot sequence. Types `~ $ <text>` with a
 * trailing block caret, then settles (the caret disappears so the nav brand's
 * cursor stays the page's only blinking caret).
 *
 * The line is decorative chrome: the animated region is aria-hidden and the
 * row height is reserved from first paint so the heading below never shifts.
 * `prefers-reduced-motion` renders the full text immediately with no typing.
 */

import { useEffect, useState } from "react";

const CHAR_MS = 55; // matches HeroTerminal's command typing speed
const START_DELAY = 240;

export default function TerminalEcho({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;

    if (prefersReduce) {
      t = setTimeout(() => {
        if (cancelled) return;
        setTyped(text);
        setDone(true);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    let ci = 0;
    const tick = () => {
      if (cancelled) return;
      if (ci < text.length) {
        ci += 1;
        setTyped(text.slice(0, ci));
        t = setTimeout(tick, CHAR_MS);
      } else {
        setDone(true);
      }
    };

    t = setTimeout(tick, START_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [text]);

  return (
    <div className="hero__term">
      <div className="hero__term-row" aria-hidden="true">
        <span className="accent">~</span> $ {typed}
        {!done && <span className="hero__term-caret" />}
      </div>
    </div>
  );
}
