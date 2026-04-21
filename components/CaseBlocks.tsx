"use client";
import { useEffect, useState } from "react";
import type { Block } from "@/lib/caseContent";

/**
 * Renders a case-study content stream as typed React blocks.
 * Styling lives in globals.css under the `.blocks` scope — CaseBlocks
 * renders semantic HTML; all typography, spacing, and color comes from
 * brand-tokens via CSS classes.
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
              <CaseImage key={i} alt={b.alt} caption={b.caption} src={b.src} />
            );
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
 * Inline text renderer that supports **bold** markdown-style emphasis.
 * Bold segments render as <strong> with a style tier bump (see globals.css).
 */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i}>{p.slice(2, -2)}</strong>;
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
}: {
  alt: string;
  caption?: string;
  src?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <figure>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onClick={() => setOpen(true)} />
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
        <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />
      )}
    </figure>
  );
}

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="lightbox"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="lightbox__close"
      >
        [ Esc ] Close
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
