"use client";
import { useEffect, useRef, useState } from "react";
import type { Block } from "@/lib/caseContent";
import { DEMO_REGISTRY } from "@/components/demos/registry";
import DitherOverlay from "@/components/DitherImage";

/**
 * Renders a case-study content stream as typed React blocks.
 * Styling lives in globals.css under the `.blocks` scope — CaseBlocks
 * renders semantic HTML; all typography, spacing, and color comes from
 * Parsimony tokens via CSS classes.
 *
 * With `reveal`, each top-level block fades up as it scrolls into view —
 * the body-stream counterpart to the hero's `.rise` stagger. The hidden
 * state is applied from JS only (progressive enhancement: no JS, no
 * hiding), and skipped entirely under prefers-reduced-motion.
 */
export default function CaseBlocks({ blocks, reveal }: { blocks: Block[]; reveal?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reveal) return;
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const children = Array.from(root.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("blk-reveal--in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    for (const child of children) {
      child.classList.add("blk-reveal");
      io.observe(child);
    }
    return () => io.disconnect();
  }, [reveal]);

  return (
    <div className="blocks" ref={rootRef}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "p":
            return (
              <p key={i}>
                <InlineText text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i}>
                <InlineText text={b.text} />
              </blockquote>
            );
          case "note":
            return (
              <div key={i} className="block-note">
                <InlineText text={b.text} />
              </div>
            );
          case "image":
            return (
              <CaseImage key={i} alt={b.alt} caption={b.caption} src={b.src} naturalSize={b.naturalSize} frame={b.frame} dither={b.dither} />
            );
          case "video":
            return (
              <CaseVideo
                key={i}
                src={b.src}
                alt={b.alt}
                caption={b.caption}
                poster={b.poster}
                naturalSize={b.naturalSize}
              />
            );
          case "image-pair":
            return (
              <div key={i} className="block-image-pair">
                {b.images.map((img, j) => (
                  <CaseImage key={j} alt={img.alt} caption={img.caption} src={img.src} />
                ))}
              </div>
            );
          case "demo": {
            const Demo = DEMO_REGISTRY[b.demo];
            return (
              <figure key={i} className="demo-frame" data-surface={b.surface ?? "light"}>
                <div className="demo-frame__chrome" aria-hidden="true">
                  <span className="demo-frame__dot" />
                  <span className="demo-frame__label">{b.frameLabel ?? "OTKit · Live component"}</span>
                </div>
                <div className="demo-frame__surface" data-surface={b.surface ?? "light"}>
                  <Demo />
                </div>
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          }
          case "embed":
            return (
              <CaseEmbed
                key={i}
                src={b.src}
                title={b.title}
                caption={b.caption}
                aspectRatio={b.aspectRatio}
                poster={b.poster}
              />
            );
          case "outcome-demo":
            return <OutcomeToggleDemo key={i} caption={b.caption} />;
          case "hr":
            return <hr key={i} />;
          case "stats":
            return (
              <ul key={i} className="block-stats">
                {b.items.map((s) => (
                  <li key={s.label} className="block-stats__item">
                    <span className="block-stats__value">{s.value}</span>
                    <span className="block-stats__label">{s.label}</span>
                  </li>
                ))}
              </ul>
            );
          case "meta":
            return (
              <div key={i} className="block-meta">
                {b.rows.map(([k, v]) => (
                  <div key={k} className="block-meta__row">
                    <div className="k">
                      {k} <span aria-hidden="true">//</span>
                    </div>
                    <div className="v">{v}</div>
                  </div>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}

/**
 * Inline text renderer. Supports **bold** and [label](url) markdown-style links.
 * External links open in a new tab with safe rel attrs.
 */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        }
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const external = /^https?:\/\//.test(href);
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </a>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/**
 * Image block with click-to-zoom lightbox.
 * Falls back to a placeholder when no src is present — useful while images
 * are still being produced.
 */
function CaseImage({
  alt,
  caption,
  src,
  naturalSize,
  frame,
  dither,
}: {
  alt: string;
  caption?: string;
  src?: string;
  naturalSize?: boolean;
  frame?: string;
  dither?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  // Develop-in: images that are still loading at hydration fade/sharpen in on
  // load. Server HTML and cached images render visible immediately (no-JS and
  // fast-path safe); only genuinely in-flight images get the treatment.
  const imgRef = useRef<HTMLImageElement>(null);
  const [developing, setDeveloping] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (dither) return; // the dither reveal owns this image's entrance
    const img = imgRef.current;
    if (!img || img.complete) return;
    const t = setTimeout(() => setDeveloping(true), 0);
    return () => clearTimeout(t);
  }, [dither]);

  const openLightbox = () => setOpen(true);
  const closeLightbox = () => {
    setOpen(false);
    // Return focus to the trigger on close so keyboard users don't lose their place
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const figureClass =
    [naturalSize ? "block-image--natural-size" : "", frame && src ? "block-image--framed" : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <figure className={figureClass}>
      {frame && src && (
        <div className="demo-frame__chrome" aria-hidden="true">
          <span className="demo-frame__dot" />
          <span className="demo-frame__label">{frame}</span>
        </div>
      )}
      {src ? (
        <div
          ref={triggerRef}
          className="block-image__wrap"
          role="button"
          tabIndex={0}
          aria-label={`Zoom image: ${alt}`}
          onClick={openLightbox}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={developing ? (loaded ? "img-develop img-develop--in" : "img-develop") : undefined}
            onLoad={() => setLoaded(true)}
          />
          {dither && <DitherOverlay imgRef={imgRef} />}
          <div className="block-image__zoom-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5V1H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 5V1H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 9V13H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 9V13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      ) : (
        <div className="block-image__placeholder">
          <div className="block-image__placeholder-inner">
            <div className="block-image__placeholder-label">
              [ Image placeholder ]
            </div>
            <div className="block-image__placeholder-alt">{alt}</div>
          </div>
        </div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
      {open && src && (
        <Lightbox src={src} alt={alt} onClose={closeLightbox} />
      )}
    </figure>
  );
}

/**
 * Video block — short product motion clips, encoded as mp4 (replacing the
 * multi-megabyte GIFs they started life as). Autoplays muted + looped like a
 * GIF would; under prefers-reduced-motion the clip stays paused on its poster
 * frame with controls exposed so playback is a deliberate choice.
 */
function CaseVideo({
  src,
  alt,
  caption,
  poster,
  naturalSize,
}: {
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  naturalSize?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.removeAttribute("autoplay");
    }
    // Deferred (not sync in the effect body) to avoid a cascading render —
    // same pattern as HeroTerminal's reduced-motion fill.
    const t = setTimeout(() => setReduced(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <figure className={naturalSize ? "block-image--natural-size" : undefined}>
      <video
        ref={videoRef}
        className="block-video"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        controls={reduced}
        preload="metadata"
        aria-label={alt}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/**
 * Live embed block — an interactive iframe framed like the other figures.
 * Shows the poster image (a screenshot of the same view) until the iframe loads,
 * so the frame is never blank. A "Live" chip signals it's the real prototype.
 */
function CaseEmbed({
  src,
  title,
  caption,
  aspectRatio,
  poster,
}: {
  src: string;
  title: string;
  caption?: string;
  aspectRatio?: string;
  poster?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="block-embed">
      <div className="block-embed__frame" style={{ aspectRatio: aspectRatio ?? "16 / 10" }}>
        {poster && !loaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="block-embed__poster" src={poster} alt="" aria-hidden="true" />
        )}
        <iframe
          src={src}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allow="fullscreen"
        />
        <span className="block-embed__badge" aria-hidden="true">
          <span className="block-embed__badge-dot" /> Live
        </span>
      </div>
      {/* Mobile fallback: embedding a wide data-table app in an iframe is unreliable
          on iOS/WebKit (the app escapes the frame and pushes the page sideways), so on
          narrow viewports we show the poster and link out to the full-screen prototype,
          which renders its own correct mobile layout. Desktop keeps the live iframe. */}
      <a
        className="block-embed__mobile"
        href={src}
        target="_blank"
        rel="noopener noreferrer"
      >
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="block-embed__mobile-img" src={poster} alt={title} />
        )}
        <span className="block-embed__mobile-cta">
          <span className="block-embed__badge-dot" /> Open the live prototype
          <span aria-hidden="true"> ↗</span>
        </span>
      </a>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Outcome = a binary Approve/Deny decision, mirroring the prototype's model. */
type Outcome = "Approve" | "Deny";

/** The example ruleset shown in the demo — echoes the live table's rows. */
const OUTCOME_DEMO_ROWS: Array<{ name: string; cond: string; initial: Outcome }> = [
  { name: "Annual income", cond: "is greater than $50,000", initial: "Approve" },
  { name: "Existing account", cond: "equals true", initial: "Approve" },
  { name: "Credit score", cond: "is less than 600", initial: "Deny" },
  { name: "Flagged for review", cond: "equals true", initial: "Deny" },
];

/**
 * Interactive reproduction of the decision-engine's segmented Approve/Deny
 * control — the real component, not a screenshot. Rendered inside a light
 * "device" card because the decision-engine is a light (arctic) sub-brand while
 * the portfolio page is dark; the arctic palette is scoped locally in
 * globals.css (`.block-outcome-demo__device`) so it reads as intentional next
 * to the surrounding light screenshots. Flipping a row slides the pill with the
 * same `--easing-spring` curve used in the live app; the sliding transition is
 * disabled under prefers-reduced-motion (also in globals.css).
 */
function OutcomeToggleDemo({ caption }: { caption?: string }) {
  const [values, setValues] = useState<Outcome[]>(
    OUTCOME_DEMO_ROWS.map((r) => r.initial)
  );
  const setAt = (i: number, v: Outcome) =>
    setValues((prev) => prev.map((cur, j) => (j === i ? v : cur)));

  return (
    <figure className="block-outcome-demo">
      <div className="block-outcome-demo__device">
        <div className="block-outcome-demo__title">Decision Model — Outcome</div>
        {OUTCOME_DEMO_ROWS.map((row, i) => (
          <div className="block-outcome-demo__row" key={row.name}>
            <div className="block-outcome-demo__rule">
              <span className="block-outcome-demo__rule-name">{row.name}</span>
              <span className="block-outcome-demo__rule-cond">{row.cond}</span>
            </div>
            <OutcomeSegment value={values[i]} onChange={(v) => setAt(i, v)} label={row.name} />
          </div>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/**
 * A single two-state segmented control. Structure mirrors the prototype's
 * OutcomeBadge: a sliding indicator pill (absolutely positioned, translates to
 * the active segment) behind two radio buttons. `data-value` on the group drives
 * the pill's position and semantic tint via CSS.
 */
function OutcomeSegment({
  value,
  onChange,
  label,
}: {
  value: Outcome;
  onChange: (v: Outcome) => void;
  label: string;
}) {
  return (
    <div
      className="block-outcome-demo__seg"
      data-value={value}
      role="radiogroup"
      aria-label={`Outcome for ${label}`}
    >
      <span
        className={`block-outcome-demo__seg-indicator${value === "Deny" ? " block-outcome-demo__seg-indicator--right" : ""}`}
        aria-hidden="true"
      />
      <button
        type="button"
        role="radio"
        aria-checked={value === "Approve"}
        onClick={() => onChange("Approve")}
        className={`block-outcome-demo__seg-btn${value === "Approve" ? " is-approve" : ""}`}
      >
        <svg className="block-outcome-demo__seg-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Approve</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "Deny"}
        onClick={() => onChange("Deny")}
        className={`block-outcome-demo__seg-btn${value === "Deny" ? " is-deny" : ""}`}
      >
        <svg className="block-outcome-demo__seg-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Deny</span>
      </button>
    </div>
  );
}

/**
 * Lightbox — full-screen image viewer.
 * WCAG 2.1 AA compliant:
 *   - role="dialog" + aria-modal so screen readers announce the context change
 *   - aria-label uses the image alt text as the dialog label
 *   - Focus moves to close button on open; returns to trigger image on close
 *   - Escape key closes; focus trap keeps Tab/Shift+Tab inside the dialog
 *   - Body scroll locked while open
 */
function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // On open: focus the close button, lock body scroll
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus trap — keep Tab/Shift+Tab inside the dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <div
      ref={overlayRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
      <button
        ref={closeRef}
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close image"
      >
        ESC / CLOSE
      </button>
    </div>
  );
}
