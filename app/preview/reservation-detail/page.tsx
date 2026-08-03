import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_REGISTRY } from "@/components/demos/registry";
import { T } from "@/lib/tokens";

/**
 * Preview harness for the `reservation-detail` demo, which is registered but
 * not yet placed in any case body — without this route there is nothing to
 * look at. It reproduces the exact chrome CaseBlocks would wrap it in (see the
 * "demo" case there), so what you see here is what the case page would render.
 *
 * Scoped to non-production by design: it renders in `npm run dev` and on branch
 * preview deployments, and 404s on the production domain even if this file
 * merges to main. Delete it once the demo is placed for real.
 */

// Vercel sets VERCEL_ENV to production | preview | development; it is unset
// locally, where dev/build should both render the page.
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  title: "Preview · iOS reservation detail",
  robots: { index: false, follow: false },
};

export default function ReservationDetailPreview() {
  if (IS_PRODUCTION) notFound();
  const Demo = DEMO_REGISTRY["reservation-detail"];
  const Editorial = DEMO_REGISTRY["reservation-detail-editorial"];

  return (
    // No <main> here — app/layout.tsx already provides it.
    <div className="column">
      {/* Not `.marginalia` — that is absolutely positioned into a gutter this
          page has no positioned ancestor for, so it renders off-screen here. */}
      <p
        style={{
          font: "var(--font-mono-label-small, var(--font-code))",
          letterSpacing: "var(--letter-spacing-all-caps)",
          textTransform: "uppercase",
          color: T.fgMuted,
          marginBottom: "var(--spacing-component)",
        }}
      >
        Preview harness — not linked from the site
      </p>
      <div className="blocks">
        <figure className="demo-frame" data-surface="light">
          <div className="demo-frame__chrome" aria-hidden="true">
            <span className="demo-frame__dot" />
            <span className="demo-frame__label">OTKit · Live component</span>
          </div>
          <div className="demo-frame__surface" data-surface="light">
            <Demo />
          </div>
          <figcaption>
            As shipped — the redesigned iOS reservation detail. Every zone is a repeatable
            pattern, and the note strip is a scroll anchor over sections that all stay mounted.
          </figcaption>
        </figure>

        <figure className="demo-frame" data-surface="light">
          <div className="demo-frame__chrome" aria-hidden="true">
            <span className="demo-frame__dot" />
            <span className="demo-frame__label">OTKit · Editorial variant</span>
          </div>
          <div className="demo-frame__surface" data-surface="light">
            <Editorial />
          </div>
          <figcaption>
            The same component and data with a different type and surface treatment — one
            display moment, hairlines instead of fills, no device chrome. The action teal
            stays: this is range within OTKit, not a different brand.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
