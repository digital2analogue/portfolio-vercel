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
 *
 * Sizing: the diagram FITS its column, and enlarges on tap.
 *
 * These are ~1240px canvases. Panning them inline was tried and rejected — it
 * cut the diagram off mid-sentence and turned every case-study scroll into a
 * sideways scrub. Fitting alone is no better on a phone (3-4px labels), so the
 * diagram is also a zoom trigger, exactly like an image block: fit inline to
 * show the composition, open full-screen to read it. The overlay is the shared
 * Lightbox, which holds a legibility floor for diagrams instead of shrinking
 * them to nothing.
 *
 * The rasterized 2x PNG sibling is what the overlay shows — it is already
 * committed as the declared fallback, and an <img> pans and pinch-zooms more
 * predictably than inline SVG.
 */

import { useEffect, useRef, useState } from "react";
import Lightbox from "@/components/Lightbox";

const STAGGER_MS = 24; // per-element delay in authored order
const MAX_DELAY_MS = 900; // stagger ceiling so long diagrams don't crawl
const FADE_MS = 480;
const DRAW_MS = 700;

export default function DiagramBlock({
  svg,
  caption,
  alt,
  src,
}: {
  svg: string;
  caption?: string;
  alt: string;
  src: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const png = src.replace(/\.svg$/, ".png");

  const close = () => {
    setOpen(false);
    // Hand focus back so keyboard users don't lose their place.
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

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
        ref={triggerRef}
        className="block-diagram__trigger"
        role="button"
        tabIndex={0}
        aria-label={`Enlarge diagram: ${alt}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); }
        }}
      >
        <div
          ref={hostRef}
          className="block-diagram__host"
          // Committed, hand-authored repo assets — not user input.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="block-image__zoom-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5V1H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 5V1H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 9V13H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 9V13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
      {open && <Lightbox src={png} alt={alt} variant="diagram" onClose={close} />}
    </figure>
  );
}
