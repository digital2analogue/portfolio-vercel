"use client";

/**
 * DiagramBlock — renders a hand-authored case-study diagram as inline SVG
 * and assembles it on scroll-in: cards and labels fade up in authored order
 * while stroked connectors draw themselves on. The animatable source (the
 * .svg the PNGs were rasterized from) finally gets used as a live surface.
 *
 * Progressive enhancement rules:
 *  - The hidden state is applied from JS only — no JS, full static diagram.
 *  - prefers-reduced-motion skips all staging; the diagram renders complete.
 *  - Elements with an authored stroke-dasharray (the amber "planned" paths)
 *    keep their dash pattern — they fade in rather than draw on.
 */

import { useEffect, useRef } from "react";

const STAGGER_MS = 24; // per-element delay in authored order
const MAX_DELAY_MS = 900; // stagger ceiling so long diagrams don't crawl
const FADE_MS = 480;
const DRAW_MS = 700;

export default function DiagramBlock({
  svg,
  caption,
}: {
  svg: string;
  caption?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const host = hostRef.current;
    const svgEl = host?.querySelector("svg");
    if (!host || !svgEl) return;

    const children = Array.from(svgEl.children) as SVGElement[];
    // Keep <defs> and the first <rect> (the canvas background) visible.
    const bg = children.find((el) => el.tagName === "rect");
    const parts = children.filter(
      (el) => el.tagName !== "defs" && el !== bg
    );

    type Staged = {
      el: SVGElement;
      delay: number;
      draw?: { length: number };
    };
    const staged: Staged[] = parts.map((el, i) => {
      const delay = Math.min(i * STAGGER_MS, MAX_DELAY_MS);
      const isGeometry = el instanceof SVGGeometryElement;
      const hasStroke =
        el.getAttribute("stroke") && el.getAttribute("stroke") !== "none";
      const keepsDash = el.hasAttribute("stroke-dasharray");
      const strokeOnly =
        !el.getAttribute("fill") || el.getAttribute("fill") === "none";
      if (isGeometry && hasStroke && strokeOnly && !keepsDash) {
        try {
          return { el, delay, draw: { length: (el as SVGGeometryElement).getTotalLength() } };
        } catch {
          return { el, delay };
        }
      }
      return { el, delay };
    });

    // Hide everything first (JS-only, so no-JS renders the full diagram).
    for (const { el, delay, draw } of staged) {
      if (draw) {
        el.style.strokeDasharray = `${draw.length}`;
        el.style.strokeDashoffset = `${draw.length}`;
        el.style.transition = `stroke-dashoffset ${DRAW_MS}ms var(--motion-easing-enter) ${delay}ms`;
      } else {
        el.style.opacity = "0";
        el.style.transition = `opacity ${FADE_MS}ms var(--motion-easing-enter) ${delay}ms`;
      }
    }

    const play = () => {
      for (const { el, draw } of staged) {
        if (draw) el.style.strokeDashoffset = "0";
        else el.style.opacity = "1";
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(host);

    return () => {
      io.disconnect();
      // Restore the authored SVG so a re-mount starts clean.
      for (const { el } of staged) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transition");
        el.style.removeProperty("stroke-dasharray");
        el.style.removeProperty("stroke-dashoffset");
      }
    };
  }, [svg]);

  return (
    <figure className="block-diagram">
      <div
        ref={hostRef}
        className="block-diagram__host"
        // Committed, hand-authored repo assets — not user input.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
