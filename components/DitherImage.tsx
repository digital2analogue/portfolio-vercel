"use client";

/**
 * DitherOverlay — the signature reveal for flagship case images.
 *
 * While an opted-in image scrolls into view it first renders as a coarse
 * 1-bit ordered-dither (4×4 Bayer matrix) in phosphor green on the page
 * canvas — the site's dithered-avatar identity applied to the media — then
 * resolves through finer dither passes and dissolves into the real image.
 *
 * Mechanics: a <canvas> overlay sits above the real <img> (which keeps all
 * a11y/lightbox behavior). When the image is loaded AND in view, the canvas
 * draws three successively finer dither passes, then fades out and unmounts.
 * Colors are sampled from the live token custom properties, not hardcoded.
 * Under prefers-reduced-motion the overlay never renders at all.
 */

import { useEffect, useRef, useState } from "react";

/** 4×4 Bayer ordered-dither threshold matrix (values 0–15). */
const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Dither pass coarseness in on-screen pixels per dither cell, coarse → fine. */
const PASSES = [10, 5, 2.5];
const PASS_MS = 190; // hold per pass
const FADE_MS = 450; // canvas dissolve after the last pass

function parseHexColor(raw: string): [number, number, number] | null {
  const m = raw.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

export default function DitherOverlay({
  imgRef,
}: {
  imgRef: React.RefObject<HTMLImageElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Reduced motion: no dither theater, the plain image is already visible.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(t);
    }

    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let io: IntersectionObserver | null = null;

    // Phosphor-on-canvas palette, read from the live tokens.
    const rootStyles = getComputedStyle(document.documentElement);
    const on =
      parseHexColor(rootStyles.getPropertyValue("--color-foreground-action")) ??
      ([74, 222, 110] as [number, number, number]);
    const off =
      parseHexColor(rootStyles.getPropertyValue("--color-background-default")) ??
      ([10, 13, 10] as [number, number, number]);

    const drawPass = (cell: number) => {
      const w = img.clientWidth;
      const h = img.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;

      const sw = Math.max(1, Math.round(w / cell));
      const sh = Math.max(1, Math.round(h / cell));
      const small = document.createElement("canvas");
      small.width = sw;
      small.height = sh;
      const sctx = small.getContext("2d", { willReadFrequently: true });
      const ctx = canvas.getContext("2d");
      if (!sctx || !ctx) return;

      sctx.drawImage(img, 0, 0, sw, sh);
      let data: ImageData;
      try {
        data = sctx.getImageData(0, 0, sw, sh);
      } catch {
        // Tainted canvas (e.g. a cross-origin src) — skip the effect quietly.
        setDone(true);
        return;
      }
      const px = data.data;
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
          const threshold = ((BAYER_4[y % 4][x % 4] + 0.5) / 16) * 255;
          const c = lum > threshold ? on : off;
          px[i] = c[0];
          px[i + 1] = c[1];
          px[i + 2] = c[2];
          px[i + 3] = 255;
        }
      }
      sctx.putImageData(data, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(small, 0, 0, sw, sh, 0, 0, w, h);
    };

    const start = () => {
      if (cancelled) return;
      // The coarsest pass is already covering the image (painted on load);
      // run the finer passes, then dissolve.
      PASSES.slice(1).forEach((cell, i) => {
        timers.push(setTimeout(() => !cancelled && drawPass(cell), (i + 1) * PASS_MS));
      });
      timers.push(
        setTimeout(() => !cancelled && setFading(true), PASSES.length * PASS_MS)
      );
      timers.push(
        setTimeout(
          () => !cancelled && setDone(true),
          PASSES.length * PASS_MS + FADE_MS + 60
        )
      );
    };

    const arm = () => {
      if (cancelled) return;
      // Cover the image with the coarsest dither immediately, so it reads as
      // dither from the first painted frame — never as the finished image.
      drawPass(PASSES[0]);
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            start();
          }
        },
        { threshold: 0.2 }
      );
      io.observe(img);
    };

    if (img.complete && img.naturalWidth > 0) {
      arm();
    } else {
      img.addEventListener("load", arm, { once: true });
    }

    return () => {
      cancelled = true;
      img.removeEventListener("load", arm);
      io?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [imgRef]);

  if (done) return null;

  return (
    <canvas
      ref={canvasRef}
      className={fading ? "dither-overlay dither-overlay--fade" : "dither-overlay"}
      aria-hidden="true"
    />
  );
}
