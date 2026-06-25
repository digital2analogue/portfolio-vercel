import type { Metadata } from "next";
import Link from "next/link";
import { catalog, tokenVersion, semanticCount, type CatToken } from "@/lib/tokenValues";

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

// Every value below is resolved at build time from the installed
// @digital2analogue2/parsimony package — names, values, and descriptions all come
// from source, so this catalog is complete and current by construction. A token
// added upstream shows up automatically; a token removed makes the build throw.

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const humanize = (name: string, prefix: string) =>
  name.slice(`--${prefix}-`.length).split("-").map(cap).join(" ");

// Feedback / status states get their own category (best-practice in most DS),
// grouped by state with each state's surface + text + on-color together.
const FEEDBACK = ["success", "warning", "danger", "info"];

type Section = { subLabel?: string; rows: CatToken[] };

// Group color tokens by category, then nest within each:
//  - Feedback (success/warning/danger/info) -> a sub-group per state
//  - Accents -> Background / Foreground / Foreground on accent
//  - other categories -> a nested "Foreground on fills" block for their on-* tokens
function groupColors(tokens: CatToken[]) {
  const order = ["Background", "Foreground", "Border", "State", "Feedback", "Accents"];
  const map: Record<string, CatToken[]> = {};
  for (const t of tokens) {
    const label = FEEDBACK.some((s) => t.name.includes(s))
      ? "Feedback"
      : t.name.includes("accent")
        ? "Accents"
        : cap(t.name.slice("--color-".length).split("-")[0]);
    (map[label] ??= []).push(t);
  }
  const labels = [
    ...order.filter((l) => map[l]),
    ...Object.keys(map).filter((l) => !order.includes(l)),
  ];
  return labels.map((label) => {
    const rows = map[label];
    if (label === "Feedback") {
      const sections: Section[] = FEEDBACK.map((s) => ({
        subLabel: cap(s),
        rows: rows.filter((t) => t.name.includes(s)),
      })).filter((s) => s.rows.length > 0);
      return { label, sections };
    }
    if (label === "Accents") {
      const sections: Section[] = [
        { subLabel: "Background", rows: rows.filter((t) => t.name.startsWith("--color-background-")) },
        { subLabel: "Foreground", rows: rows.filter((t) => t.name.startsWith("--color-foreground-") && !t.name.includes("-on-")) },
        { subLabel: "Foreground on accent", rows: rows.filter((t) => t.name.includes("-on-")) },
      ];
      return { label, sections: sections.filter((s) => s.rows.length > 0) };
    }
    const main = rows.filter((t) => !t.name.includes("-on-"));
    const on = rows.filter((t) => t.name.includes("-on-"));
    const sections: Section[] = [{ rows: main }];
    if (on.length > 0) sections.push({ subLabel: "Foreground on fills", rows: on });
    return { label, sections };
  });
}

function SubLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        font: "var(--font-mono-label-small)",
        color: "var(--color-foreground-muted)",
        letterSpacing: "var(--letter-spacing-label)",
        margin: "var(--spacing-component) 0 var(--spacing-tight)",
      }}
    >
      {text}
    </div>
  );
}

function ColorRow({ row }: { row: CatToken }) {
  return (
    <div className="tokens-row">
      <span
        className="tokens-row__swatch"
        style={{ background: row.value }}
        aria-hidden="true"
      />
      <div className="tokens-row__body">
        <code className="tokens-row__token">{row.name}</code>
        <div className="tokens-row__role">{row.description}</div>
      </div>
      <code className="tokens-row__value">{row.value}</code>
    </div>
  );
}

const COLOR_GROUPS = groupColors(catalog("color"));

// The font category mixes full shorthands (renderable via `font:`) with bare
// family tokens (just a typeface — must render via `fontFamily:`). Split them.
const FONT = catalog("font");
const FAMILIES = FONT.filter((t) => t.name.startsWith("--font-family-"));
const TYPE = FONT.filter((t) => !t.name.startsWith("--font-family-"));

// Group the type shorthands by role so Typography has the same group → rows
// depth as Color. Matches are mutually exclusive, so array order = display
// order (Label must exclude Label Strong; both differ from Mono Label).
const TYPE_ROLES: { label: string; match: (n: string) => boolean }[] = [
  { label: "Display", match: (n) => n === "--font-display" },
  { label: "Title", match: (n) => n.startsWith("--font-title-") },
  { label: "Body", match: (n) => n.startsWith("--font-body-") },
  {
    label: "Label",
    match: (n) =>
      n.startsWith("--font-label-") && !n.startsWith("--font-label-strong-"),
  },
  { label: "Label Strong", match: (n) => n.startsWith("--font-label-strong-") },
  { label: "Mono Label", match: (n) => n.startsWith("--font-mono-label-") },
  { label: "Code", match: (n) => n === "--font-code" },
];

function groupType(tokens: CatToken[]) {
  const groups = TYPE_ROLES.map((role) => ({
    label: role.label,
    rows: tokens.filter((t) => role.match(t.name)),
  })).filter((g) => g.rows.length > 0);
  // Surface anything unmatched so the catalog stays complete by construction.
  const seen = new Set(groups.flatMap((g) => g.rows.map((r) => r.name)));
  const rest = tokens.filter((t) => !seen.has(t.name));
  if (rest.length > 0) groups.push({ label: "Other", rows: rest });
  return groups;
}

const TYPE_GROUPS = groupType(TYPE);
const SPACING = catalog("spacing");
const RADIUS = catalog("radius");
const MOTION = catalog("motion");
const SHADOW = catalog("shadow");
const LETTER = catalog("letter-spacing");
const ICON = catalog("icon");

function SectionHead({ title, italic }: { title: string; italic?: string }) {
  return (
    <div className="section-head">
      <h2 className="eyebrow">
        <span>
          {title} <span aria-hidden="true">//</span>
        </span>
        {italic && <span className="eyebrow__italic">{italic}</span>}
      </h2>
    </div>
  );
}

// Generic name / value / description rows — used for motion, shadow,
// letter-spacing, and icon.
function CompactSection({
  title,
  italic,
  note,
  tokens,
}: {
  title: string;
  italic?: string;
  note?: string;
  tokens: CatToken[];
}) {
  return (
    <>
      <SectionHead title={title} italic={italic} />
      {note && (
        <p
          style={{
            font: "var(--font-body-small)",
            color: "var(--color-foreground-muted)",
            margin: "0 0 var(--spacing-component)",
          }}
        >
          {note}
        </p>
      )}
      <div className="tokens-compact">
        {tokens.map((t) => (
          <div key={t.name} className="tokens-compact__row">
            <code className="tokens-row__token">{t.name}</code>
            <code className="tokens-row__value">{t.value}</code>
            <div className="tokens-row__role">{t.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

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
          <span>{semanticCount} semantic tokens, generated from source</span>
        </div>
      </section>

      <div className="dot-rule rise d5" aria-hidden="true" />

      {/* ═══════════════ COLOR ═══════════════ */}
      <SectionHead title="Color" italic="every hex earns its way in" />
      <div className="tokens-group rise d6">
        {COLOR_GROUPS.map((group) => (
          <div key={group.label} className="tokens-group__tier">
            <div className="tokens-group__label">{group.label}</div>
            {group.sections.map((section, i) => (
              <div key={section.subLabel ?? i}>
                {section.subLabel && <SubLabel text={section.subLabel} />}
                {section.rows.map((row) => (
                  <ColorRow key={row.name} row={row} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="dot-rule rise d6" aria-hidden="true" />

      {/* ═══════════════ TYPOGRAPHY ═══════════════ */}
      <SectionHead title="Typography" italic="three voices, one system" />
      <div className="rise d7">
        <div className="tokens-type">
          <SubLabel text="Families" />
          {FAMILIES.map((t) => (
            <div key={t.name} className="tokens-type__row">
              <div className="tokens-type__meta">
                <code className="tokens-row__token">{t.name}</code>
                <div className="tokens-type__size">{t.value}</div>
              </div>
              <div
                className="tokens-type__sample"
                style={{ fontFamily: `var(${t.name})`, fontSize: "1.5rem" }}
              >
                Aa Bb Cc 0123
              </div>
            </div>
          ))}
          {TYPE_GROUPS.map((group) => (
            <div key={group.label}>
              <SubLabel text={group.label} />
              {group.rows.map((t) => (
                <div key={t.name} className="tokens-type__row">
                  <div className="tokens-type__meta">
                    <code className="tokens-row__token">{t.name}</code>
                    <div className="tokens-type__size">{t.description}</div>
                  </div>
                  <div
                    className="tokens-type__sample"
                    style={{ font: `var(${t.name})` }}
                  >
                    {humanize(t.name, "font")}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Letter-spacing lives under Typography — it's a type property, not a
            standalone token family. */}
        <SubLabel text="Letter-spacing" />
        <div className="tokens-compact">
          {LETTER.map((t) => (
            <div key={t.name} className="tokens-compact__row">
              <code className="tokens-row__token">{t.name}</code>
              <code className="tokens-row__value">{t.value}</code>
              <div className="tokens-row__role">{t.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dot-rule rise d7" aria-hidden="true" />

      {/* ═══════════════ SPACING ═══════════════ */}
      <SectionHead title="Spacing" italic="8-point base scale" />
      <div className="tokens-spacing rise d8">
        {SPACING.map((s) => (
          <div key={s.name} className="tokens-spacing__row">
            <div className="tokens-spacing__meta">
              <code className="tokens-row__token">{s.name}</code>
              <div className="tokens-row__role">{s.description}</div>
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

      <div className="dot-rule rise d8" aria-hidden="true" />

      {/* ═══════════════ RADIUS ═══════════════ */}
      <SectionHead title="Radius" />
      <div className="tokens-radius rise d8">
        {RADIUS.map((r) => (
          <div key={r.name} className="tokens-radius__row">
            <div
              className="tokens-radius__swatch"
              style={{ borderRadius: r.value }}
              aria-hidden="true"
            />
            <div className="tokens-radius__body">
              <code className="tokens-row__token">{r.name}</code>
              <div className="tokens-row__role">{r.description}</div>
            </div>
            <code className="tokens-row__value">{r.value}</code>
          </div>
        ))}
      </div>

      <div className="dot-rule rise d8" aria-hidden="true" />

      {/* ═══════════════ MOTION / SHADOW / LETTER-SPACING / ICON ═══════════════ */}
      <div className="rise d8">
        <CompactSection title="Motion" italic="duration + easing" tokens={MOTION} />
      </div>
      <div className="rise d8" style={{ marginTop: "var(--spacing-layout)" }}>
        <CompactSection title="Shadow" italic="elevation, used sparingly" tokens={SHADOW} />
      </div>
      <div className="rise d8" style={{ marginTop: "var(--spacing-layout)" }}>
        <CompactSection
          title="Icon size"
          italic="under construction"
          note="Provisional — the icon system isn't finalized yet, so these sizes are placeholders and may change."
          tokens={ICON}
        />
      </div>

      <div className="dot-rule rise d8" aria-hidden="true" />

      <p className="bio-inline rise d8">
        Every token above is generated at build time from{" "}
        <a
          href="https://github.com/digital2analogue/brand-tokens"
          className="accent"
        >
          Parsimony
        </a>
        , so this page can&rsquo;t drift from the source. Component-scoped tokens
        (badge, button, input, and so on) aren&rsquo;t listed here, they live in
        each component&rsquo;s own contract. This portfolio is the system{" "}
        <em>eating its own dog food</em>.
      </p>

      <p className="bio-inline rise d8">
        Back to <Link href="/">the index</Link> or{" "}
        <Link href="/work">selected work</Link>.
      </p>
    </div>
  );
}
