"use client";

/**
 * Full-screen zoom overlay, shared by image blocks and diagram blocks.
 *
 * `variant="diagram"` changes the fit rule rather than the chrome. A photo
 * should shrink to fit the viewport; a diagram shrunk to fit a 390px phone
 * renders 3px labels, so it instead holds a legibility floor and pans inside
 * the overlay. See `.lightbox--diagram` in globals.css.
 */
import { useEffect, useRef } from "react";

export default function Lightbox({
  src,
  alt,
  onClose,
  variant,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  variant?: "diagram";
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
      className={variant === "diagram" ? "lightbox lightbox--diagram" : "lightbox"}
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
        aria-label={variant === "diagram" ? "Close diagram" : "Close image"}
      >
        ESC / CLOSE
      </button>
    </div>
  );
}
