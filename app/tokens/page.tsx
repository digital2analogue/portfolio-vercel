import type { Metadata } from "next";
import Link from "next/link";
import { tokenValue, tokenVersion } from "@/lib/tokenValues";

export const metadata: Metadata = {
  title: "Design Tokens",
  description:
    "The Parsimony design system that powers every River Romney property: primitives, semantic tokens, and a clear contract between design and code.",
  alternates: { canonical: "/tokens" },
  openGraph: {
    title: "Design Tokens · River Romney",
    description:
      "Parsimony design system: colors, typography, spacing, motion, radius.",
    url: "/tokens",
  },
};

// Token names + curated roles are hand-written; VALUES (hex, sizes, durations)
// are resolved at build time from the installed @digital2analogue2/tokens
// package, so this catalog can't drift from what the site actually ships. If a
// token is renamed or removed upstream, tokenValue() throws and the build fails.

// Color tokens grouped by tier
const COLORS = [
  {
    group: "Background",
    rows: [
      { token: "--color-background-default", role: "Page canvas. Every full-bleed surface." },
      { token: "--color-background-alt", role: "Elevated surfaces: cards, panels, inputs." },
      { token: "--color-background-action", role: "Interactive fills: primary buttons, selected states." },
    ],
  },
  {
    group: "Foreground",
    rows: [
      { token: "--color-foreground-default", role: "Primary text and icons. AAA contrast (12.3:1)." },
      { token: "--color-foreground-alt", role: "Secondary text: subtitles, metadata. AA (8.0:1)." },
      { token: "--color-foreground-muted", role: "Tertiary content: placeholders, fine print. AA (6.3:1)." },
      { token: "--color-foreground-action", role: "Interactive text: links, active nav. AAA (11.3:1)." },
    ],
  },
  {
    group: "Border",
    rows: [
      { token: "--color-border-default", role: "All UI edges. Borders recede rather than frame." },
    ],
  },
].map((g) => ({
  ...g,
  rows: g.rows.map((r) => ({ ...r, hex: tokenValue(r.token) })),
}));

// Typography scale: semantic shorthand tokens. Each sample renders with the real
// token (font: var(--token)), so the type is already live; the size annotation
// is a description.
const BODY_SAMPLE = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.";
const TYPE = [
  { token: "--font-display",      label: "Display",        sample: "Display",       size: "40px / 1.1 · Space Grotesk 300" },
  { token: "--font-title-large",  label: "Title Large",    sample: "Title Large",   size: "32px / 1.25 · Space Grotesk 300" },
  { token: "--font-title-medium", label: "Title Medium",   sample: "Title Medium",  size: "24px / 1.25 · Space Grotesk 300" },
  { token: "--font-title-small",  label: "Title Small",    sample: "Title Small",   size: "20px / 1.25 · Space Grotesk 300" },
  { token: "--font-body-large",   label: "Body Large",     sample: BODY_SAMPLE,     size: "16px / 1.6 · Spectral 400" },
  { token: "--font-body-medium",  label: "Body Medium",    sample: BODY_SAMPLE,     size: "14px / 1.6 · Spectral 400" },
  { token: "--font-body-small",   label: "Body Small",     sample: BODY_SAMPLE,     size: "12px / 1.6 · Spectral 400" },
  { token: "--font-label-large",  label: "Label Large",    sample: "Label Large",   size: "16px / 1.25 · JetBrains Mono 400" },
  { token: "--font-label-medium", label: "Label Medium",   sample: "Label Medium",  size: "14px / 1.25 · JetBrains Mono 400" },
  { token: "--font-label-small",  label: "Label Small",    sample: "Label Small",   size: "12px / 1.25 · JetBrains Mono 400" },
  { token: "--font-code",         label: "Code",           sample: "Code",          size: "14px / 1.6 · JetBrains Mono 400" },
];

// Spacing scale: semantic (values resolved from the package)
const SPACING = [
  { token: "--spacing-tight", role: "Icon + label, checkbox + text" },
  { token: "--spacing-inline", role: "Nav row, tag groups" },
  { token: "--spacing-element", role: "Internal padding, default unit" },
  { token: "--spacing-component", role: "Between sibling components" },
  { token: "--spacing-layout", role: "Between major layout regions" },
  { token: "--spacing-section", role: "Between top-level page sections" },
].map((s) => ({ ...s, value: tokenValue(s.token) }));

// Motion: duration (values resolved from the package)
const MOTION = [
  { token: "--motion-duration-instant", role: "Hover, focus ring, micro-interactions" },
  { token: "--motion-duration-standard", role: "Dropdowns, tooltips, accordions" },
  { token: "--motion-duration-emphasized", role: "Modals, drawers, page-level transitions" },
].map((m) => ({ ...m, value: tokenValue(m.token) }));

// Radius (values resolved from the package)
const RADIUS = [
  { token: "--radius-none", role: "Code blocks, tables, structural" },
  { token: "--radius-sm", role: "Inputs, small tags, inline chips" },
  { token: "--radius-default", role: "Buttons, dropdowns, most interactive" },
  { token: "--radius-lg", role: "Cards, panels, content regions" },
  { token: "--radius-xl", role: "Modals, hero cards, featured surfaces" },
  { token: "--radius-full", role: "Pills, avatars, toggle switches" },
].map((r) => ({ ...r, value: tokenValue(r.token) }));

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
            ./parsimony.md
          </div>
        </div>

        <h1 className="display rise d2">
          The <em>system</em> behind the system.
        </h1>

        <p className="lede rise d3">
          Every color, type style, spacing value, motion, and radius on this
          site comes from <span className="accent">Parsimony</span>, a
          design system I maintain to keep every River Romney property
          consistent. Primitives feed the semantic layer. UI code never
          touches hex.
        </p>

        <p className="lede rise d4">
          The architecture takes a cue from Unix&rsquo;s{" "}
          <em>small, sharp tools</em> philosophy. Primitives hold values,
          semantics name roles, and components render decisions. Each layer
          does one thing well, and the next composes from it.
        </p>

        <div className="single-status rise d4">
          <span className="status-dot" aria-hidden="true">●</span>
          &nbsp;<span className="single-status__v">v{tokenVersion} · Production</span>
          <span className="single-status__sep" aria-hidden="true">·</span>
          <span>primitives → semantic → component</span>
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
          Parsimony
        </a>{" "}
        repo: Style Dictionary pipeline, per-brand overrides, and a clear
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
