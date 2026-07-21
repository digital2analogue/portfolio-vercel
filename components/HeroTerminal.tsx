"use client";

/**
 * HeroTerminal — the home hero's terminal block, typed like a real boot
 * sequence instead of a static screenshot with a fade-in.
 *
 * On load it types `whoami`, "runs" it, then types the two `//` answer lines,
 * a blinking block caret trailing the active character. All three line rows are
 * reserved from first paint so nothing below shifts as text fills in. A
 * visually-hidden static copy carries the real content to assistive tech, and
 * `prefers-reduced-motion` renders the full text immediately with no typing.
 */

import { useEffect, useState } from "react";

type Line = {
  /** Prompt line — renders the `~ $ ` chrome and types a command. */
  prompt?: boolean;
  /** Answer line — renders the `// ` comment slash. */
  slash?: boolean;
  /** The first answer uses the brighter answer color. */
  ans?: boolean;
  text: string;
};

const LINES: Line[] = [
  { prompt: true, text: "whoami" },
  { slash: true, ans: true, text: "River, Principal Designer" },
  { slash: true, text: "Design systems. Compliance-heavy fintech." },
];

const CHAR_MS = 24; // answer lines
const CMD_MS = 55; // the typed command, a touch slower for weight
const LINE_PAUSE = 200;
const START_DELAY = 240;

export default function HeroTerminal() {
  // Substring currently revealed for each line.
  const [typed, setTyped] = useState<string[]>(["", "", ""]);
  // Line the caret sits on; clamped to the last line when done.
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  // When motion is reduced we render the full text with no caret — identical to
  // the previous static hero, so the caret is purely a live-typing affordance.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;

    // Reduced motion: fill instantly (in a task, not synchronously in the
    // effect body) and skip the caret — matches the previous static hero.
    if (prefersReduce) {
      t = setTimeout(() => {
        if (cancelled) return;
        setTyped(LINES.map((l) => l.text));
        setActive(LINES.length - 1);
        setReduced(true);
        setDone(true);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    let li = 0;
    let ci = 0;
    const buf = ["", "", ""];

    const tick = () => {
      if (cancelled) return;
      if (li >= LINES.length) {
        setActive(LINES.length - 1);
        setDone(true);
        return;
      }
      const full = LINES[li].text;
      if (ci < full.length) {
        buf[li] = full.slice(0, ci + 1);
        setTyped([...buf]);
        ci += 1;
        t = setTimeout(tick, LINES[li].prompt ? CMD_MS : CHAR_MS);
      } else {
        li += 1;
        ci = 0;
        setActive(li);
        t = setTimeout(tick, LINE_PAUSE);
      }
    };

    t = setTimeout(tick, START_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const caret = <span className="hero__term-caret" aria-hidden="true" />;

  return (
    <div className="hero__term rise d1">
      {/* Screen-reader copy — the real content, read once, no typing artifacts. */}
      <span className="sr-only">River, Principal Designer. Design systems, compliance-heavy fintech.</span>

      <div aria-hidden="true">
        {LINES.map((line, i) => {
          // Caret only while the boot sequence is typing. Once settled it goes
          // away — the nav brand's cursor stays the page's only blinking caret.
          const showCaret = !reduced && !done && i === active;
          return (
            <div key={i} className="hero__term-row">
              {line.prompt && (
                <>
                  <span className="accent">~</span> $ {typed[i]}
                </>
              )}
              {line.slash && (
                <>
                  <span className="hero__term-slash">// </span>
                  <span className={line.ans ? "hero__term-ans" : undefined}>{typed[i]}</span>
                </>
              )}
              {showCaret && caret}
            </div>
          );
        })}
      </div>
    </div>
  );
}
