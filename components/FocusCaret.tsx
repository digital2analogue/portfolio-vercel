"use client";
import { useEffect } from "react";

/**
 * Focus-following phosphor caret.
 * Tracks keyboard focus — invisible until you tab, disappears on mouse click.
 * Signals IDE-craft attention at a level most portfolios don't bother with.
 */
export default function FocusCaret() {
  useEffect(() => {
    const caret = document.getElementById("focus-caret");
    if (!caret) return;

    const place = (el: Element) => {
      if (!el || el === document.body) {
        caret.classList.remove("visible");
        return;
      }
      const r = el.getBoundingClientRect();
      let x = r.left - 14;
      const y = r.top + r.height / 2 - 7;
      if (x < 2) x = 2;
      caret.style.transform = `translate(${x}px, ${y}px)`;
      caret.classList.add("visible");
    };

    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as Element | null;
      if (!t || !(t instanceof Element)) return;
      try {
        if (t.matches(":focus-visible")) place(t);
      } catch {
        place(t);
      }
    };
    const onFocusOut = () => caret.classList.remove("visible");
    const onMouseDown = () => caret.classList.remove("visible");
    const onReposition = () => {
      const a = document.activeElement;
      if (a instanceof Element && a.matches(":focus-visible")) place(a);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onReposition, { passive: true });
    window.addEventListener("resize", onReposition, { passive: true });

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onReposition);
      window.removeEventListener("resize", onReposition);
    };
  }, []);

  return <div id="focus-caret" aria-hidden="true" />;
}
