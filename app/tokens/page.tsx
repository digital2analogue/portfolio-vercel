import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design Tokens",
  description:
    "The brand-tokens design system that powers every River Romney property — primitives, semantic tokens, and a clear contract between design and code.",
  alternates: { canonical: "/tokens" },
  openGraph: {
    title: "Design Tokens · River Romney",
    description:
      "Brand-tokens design system — colors, typography, spacing, motion, radius.",
    url: "/tokens",
  },
};

// Color tokens grouped by tier
const COLORS = [
  {
    group: "Background",
    rows: [
      { token: "--color-background-default", hex: "#0A0D0A", role: "Page canvas. Every full-bleed surface." },
      { token: "--color-background-alt", hex: "#1E241E", role: "Elevated surfaces — cards, panels, inputs." },
      { token: "--color-background-action", hex: "#4ADE6E", role: "Interactive fills — primary buttons, selected states." },
    ],
  },
  {
    group: "Foreground",
    rows: [
      { token: "--color-foreground-default", hex: "#C8CFC4", role: "Primary text and icons. AAA contrast (12.3:1)." },
      { token: "--color-foreground-alt", hex: "#A0A89A", role: "Secondary text — subtitles, metadata. AA (8.0:1)." },
      { token: "--color-foreground-muted", hex: "#8B9683", role: "Tertiary content — placeholders, fine print. AA (6.3:1)." },
      { token: "--color-foreground-action", hex: "#4ADE6E", role: "Interactive text — links, active nav. AAA (11.3:1)." },
    ],
  },
  {
    group: "Border",
    rows: [
      { token: "--color-border-default", hex: "#1E241E", role: "All UI edges. Borders recede — they don't frame." },
    ],
  },
];

// Typography scale — semantic shorthand tokens
const TYPE = [
  { token: "--font-display", label: "Display", sample: "Product design for systems that scale.", size: "40px / 1.1 · Space Grotesk 300" },
  { token: "--font-title-large", label: "Title — Large", sample: "Case studies", size: "32px / 1.25 · Space Grotesk 300" },
  { token: "--font-title-medium", label: "Title — Medium", sample: "Selected work", size: "24px / 1.25 · Space Grotesk 300" },
  { token: "--font-title-small", label: "Title — Small", sample: "Decision Engine", size: "20px / 1.25 · Space Grotesk 300" },
  { token: "--font-body-large", label: "Body — Large", sample: "I design decision tooling, compliance surfaces, and design systems at the intersection of policy, data, and enterprise UX.", size: "16px / 1.6 · Spectral 400" },
  { token: "--font-label-medium", label: "Label — Medium", sample: "SELECTED WORK //", size: "14px / 1.25 · Space Grotesk 400" },
  { token: "--font-code", label: "Code", sample: "$ cat ./tokens.md", size: "14px / 1.6 · JetBrains Mono 400" },
];

// Spacing scale — semantic
const SPACING = [
  { token: "--spacing-tight", value: "8px", role: "Icon + label, checkbox + text" },
  { token: "--spacing-inline", value: "12px", role: "Nav row, tag groups" },
  { token: "--spacing-element", value: "16px", role: "Internal padding, default unit" },
  { token: "--spacing-component", value: "24px", role: "Between sibling components" },
  { token: "--spacing-layout", value: "48px", role: "Between major layout regions" },
  { token: "--spacing-section", value: "128px", role: "Between top-level page sections" },
];

// Motion — duration + easing
const MOTION = [
  { token: "--motion-duration-instant", value: "120ms", role: "Hover, focus ring, micro-interactions" },
  { token: "--motion-duration-standard", value: "200ms", role: "Dropdowns, tooltips, accordions" },
  { token: "--motion-duration-emphasized", value: "350ms", role: "Modals, drawers, page-level transitions" },
];

// Radius
const RADIUS = [
  { token: "--radius-none", value: "0", role: "Code blocks, tables, structural" },
  { token: "--radius-sm", value: "4px", role: "Inputs, small tags, inline chips" },
  { token: "--radius-default", value: "8px", role: "Buttons, dropdowns, most interactive" },
  { token: "--radius-lg", value: "12px", role: "Cards, panels, content regions" },
  { token: "--radius-xl", value: "16px", role: "Modals, hero cards, featured surfaces" },
  { token: "--radius-full", value: "9999px", role: "Pills, avatars, toggle switches" },
];

export default function TokensPage() {
  return (
    <div className="column">
      <section className="hero">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">01</span>&nbsp;/&nbsp;TOKENS
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ cat
            ./brand-tokens.md
          </div>
        </div>

        <h1 className="display rise d2">
          The <em>system</em> behind the system.
        </h1>

        <p className="lede rise d3">
          Every color, type style, spacing value, motion, and radius on this
          site comes from <span className="accent">brand-tokens</span> — a
          design system I maintain to keep every River Romney property
          consistent. Primitives feed the semantic layer. UI code never
          touches hex.
        </p>

        <div className="single-status rise d4">
          <span className="status-dot" aria-hidden="true">●</span>
          &nbsp;<span className="single-status__v">v0.3 · Production</span>
          <span className="single-status__sep" aria-hidden="true">·</span>
          <span>44 semantic tokens across 6 tiers</span>
        </div>
      </section>

      <div className="dot-rule rise d5" aria-hidden="true">
        · · · · · · · ·
      </div>

      {/* ═══════════════ COLOR ═══════════════ */}
      <div className="section-head rise d5">
        <h2 className="eyebrow">
          <span>
            Color <span aria-hidden="true">//</span>
          </span>
          <span className="eyebrow__italic">every hex earns its way in</span>
        </h2>
      </div>

      <div className="tokens-group rise d6">
        {COLORS.map((group) => (
          <div key={group.group} className="tokens-group__tier">
            <div className="tokens-group__label">{group.group}</div>
            {group.rows.map((row) => (
              <div key={row.token} className="tokens-row">
                <span
                  className="tokens-row__swatch"
                  style={{ background: row.hex }}
                  aria-hidden="true"
                />
                <div className="tokens-row__body">
                  <code className="tokens-row__token">{row.token}</code>
                  <div className="tokens-row__role">{row.role}</div>
                </div>
                <code className="tokens-row__value">{row.hex}</code>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="dot-rule rise d6" aria-hidden="true">
        · · · · · · · ·
      </div>

      {/* ═══════════════ TYPOGRAPHY ═══════════════ */}
      <div className="section-head rise d6">
        <h2 className="eyebrow">
          <span>
            Typography <span aria-hidden="true">//</span>
          </span>
          <span className="eyebrow__italic">three voices, one system</span>
        </h2>
      </div>

      <div className="tokens-type rise d7">
        {TYPE.map((t) => (
          <div key={t.token} className="tokens-type__row">
            <div className="tokens-type__meta">
              <code className="tokens-row__token">{t.token}</code>
              <div className="tokens-type__size">{t.size}</div>
            </div>
            <div
              className="tokens-type__sample"
              style={{ font: `var(${t.token})` }}
            >
              {t.sample}
            </div>
          </div>
        ))}
      </div>

      <div className="dot-rule rise d7" aria-hidden="true">
        · · · · · · · ·
      </div>

      {/* ═══════════════ SPACING ═══════════════ */}
      <div className="section-head rise d7">
        <h2 className="eyebrow">
          <span>
            Spacing <span aria-hidden="true">//</span>
          </span>
          <span className="eyebrow__italic">8-point base, six semantic tiers</span>
        </h2>
      </div>

      <div className="tokens-spacing rise d8">
        {SPACING.map((s) => (
          <div key={s.token} className="tokens-spacing__row">
            <div className="tokens-spacing__meta">
              <code className="tokens-row__token">{s.token}</code>
              <div className="tokens-row__role">{s.role}</div>
            </div>
            <div
              className="tokens-spacing__bar"
              style={{ width: s.value }}
              aria-hidden="true"
            />
            <code className="tokens-row__value">{s.value}</code>
          </div>
        ))}
      </div>

      <div className="dot-rule rise d8" aria-hidden="true">
        · · · · · · · ·
      </div>

      {/* ═══════════════ MOTION + RADIUS ═══════════════ */}
      <div className="tokens-split rise d8">
        <div>
          <div className="section-head">
            <h2 className="eyebrow">
              <span>
                Motion <span aria-hidden="true">//</span>
              </span>
            </h2>
          </div>
          <div className="tokens-compact">
            {MOTION.map((m) => (
              <div key={m.token} className="tokens-compact__row">
                <code className="tokens-row__token">{m.token}</code>
                <code className="tokens-row__value">{m.value}</code>
                <div className="tokens-row__role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-head">
            <h2 className="eyebrow">
              <span>
                Radius <span aria-hidden="true">//</span>
              </span>
            </h2>
          </div>
          <div className="tokens-radius">
            {RADIUS.map((r) => (
              <div key={r.token} className="tokens-radius__row">
                <div
                  className="tokens-radius__swatch"
                  style={{ borderRadius: r.value }}
                  aria-hidden="true"
                />
                <div className="tokens-radius__body">
                  <code className="tokens-row__token">{r.token}</code>
                  <div className="tokens-row__role">{r.role}</div>
                </div>
                <code className="tokens-row__value">{r.value}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dot-rule rise d8" aria-hidden="true">
        · · · · · · · ·
      </div>

      <p className="bio-inline rise d8">
        The full token source lives in the{" "}
        <a
          href="https://github.com/digital2analogue/brand-tokens"
          className="accent"
        >
          brand-tokens
        </a>{" "}
        repo — Style Dictionary pipeline, per-brand overrides, and a clear
        primitive → semantic contract. This portfolio is the system{" "}
        <em>eating its own dog food</em>.
      </p>

      <p className="bio-inline rise d8">
        Back to <Link href="/">the index</Link> or{" "}
        <Link href="/work">selected work</Link>.
      </p>
    </div>
  );
}
