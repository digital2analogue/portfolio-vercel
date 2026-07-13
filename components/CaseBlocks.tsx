"use client";
import { useEffect, useRef, useState } from "react";
import type { Block } from "@/lib/caseContent";
import { DEMO_REGISTRY } from "@/components/demos/registry";

/**
 * Renders a case-study content stream as typed React blocks.
 * Styling lives in globals.css under the `.blocks` scope — CaseBlocks
 * renders semantic HTML; all typography, spacing, and color comes from
 * Parsimony tokens via CSS classes.
 */
export default function CaseBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="blocks">
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
              <CaseImage key={i} alt={b.alt} caption={b.caption} src={b.src} naturalSize={b.naturalSize} />
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
              <figure key={i} className="demo-frame">
                <div className="demo-frame__chrome" aria-hidden="true">
                  <span className="demo-frame__dot" />
                  <span className="demo-frame__label">{b.frameLabel ?? "OTKit · Live component"}</span>
                </div>
                <div className="demo-frame__surface">
                  <Demo />
                </div>
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          }
          case "hr":
            return <hr key={i} />;
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
}: {
  alt: string;
  caption?: string;
  src?: string;
  naturalSize?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const openLightbox = () => setOpen(true);
  const closeLightbox = () => {
    setOpen(false);
    // Return focus to the trigger on close so keyboard users don't lose their place
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <figure className={naturalSize ? "block-image--natural-size" : undefined}>
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
          <img src={src} alt={alt} />
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
