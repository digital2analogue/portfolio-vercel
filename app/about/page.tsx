import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "I build the layer other designers build on: design systems infrastructure, decision tooling, and compliance-heavy B2B. Ten years, San Francisco, open to senior IC and staff roles.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · River Romney",
    description:
      "Principal Designer with ten years in design systems infrastructure, decision tooling, and compliance-heavy B2B.",
    url: "/about",
  },
};

const SKILLS = [
  "Design Systems",
  "B2B / Enterprise UX",
  "Compliance UX",
  "Decision Tooling",
  "Figma",
  "Research",
  "Prototyping",
  "Cross-functional Leadership",
];

const EXPERIENCE = [
  {
    role: "Designer & Design Engineer",
    company: "Independent",
    period: "2026 – present",
  },
  {
    role: "Career break",
    company: "Family bereavement",
    period: "2025 – 2026",
    note: "Design-systems research. First version of Parsimony.",
  },
  {
    role: "Principal UI/UX Designer, Design Systems",
    company: "Capital One",
    period: "2024 – 2025",
  },
  {
    role: "Lead Product Designer, Design Systems · Product Owner",
    company: "OpenTable",
    period: "2023 – 2024",
  },
  {
    role: "Senior Product Designer",
    company: "OpenTable",
    period: "2019 – 2023",
  },
  {
    role: "Product Designer",
    company: "EPIC!",
    period: "2018 – 2019",
  },
  {
    role: "Interaction Designer",
    company: "ExpertVoice",
    period: "2015 – 2018",
  },
];

/* One line each: the position, the receipt, and a link to the work that
   proves it. Prose paragraphs here were a wall — the page has to be legible
   at a glance, and a claim plus its number reads faster than a sentence. */
const PRINCIPLES = [
  {
    n: "01",
    claim: "Name the cost in dollars",
    receipt: "≈$390K drift, priced and funded",
    href: "/work/ot-design-system",
  },
  {
    n: "02",
    claim: "Adoption is advocacy, not enforcement",
    receipt: "6 teams, no mandate",
    href: "/work/ot-design-system",
  },
  {
    n: "03",
    claim: "Foundations first, nothing pauses",
    receipt: "shipped with zero regressions",
    href: "/work/ot-reservations",
  },
  {
    n: "04",
    claim: "Measure the claim, publish the failure",
    receipt: "95% vs 70%, machine-scored",
    href: "/work/system",
  },
];

export default function AboutPage() {
  return (
    <div className="column">
      <section className="hero">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">01</span>&nbsp;/&nbsp;ABOUT
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ cat ./about.md
          </div>
        </div>

        <h1 className="display rise d2">
          River <em>Romney</em>
        </h1>
      </section>

      <div className="dot-rule rise d3" aria-hidden="true" />

      <div className="about-prose rise d4">
        <p>
          I build the layer other designers build on. Ten years in{" "}
          <em>design systems, decision tooling,</em> and compliance-heavy
          enterprise UX. The work is making the rules, states and edge cases
          software buries legible.
        </p>
      </div>

      <div className="section-head rise d5" style={{ marginTop: "var(--spacing-layout)" }}>
        <h2 className="eyebrow">
          <span>
            How I work <span aria-hidden="true">//</span>
          </span>
        </h2>
      </div>

      <ol className="principles rise d5">
        {PRINCIPLES.map((p) => (
          <li key={p.n}>
            <Link className="principle" href={p.href}>
              <span className="principle__n" aria-hidden="true">{p.n}</span>
              <span className="principle__claim">{p.claim}</span>
              <span className="principle__receipt">{p.receipt}</span>
              <span className="principle__arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="section-head rise d5" style={{ marginTop: "var(--spacing-layout)" }}>
        <h2 className="eyebrow">
          <span>
            Currently strong in <span aria-hidden="true">//</span>
          </span>
        </h2>
      </div>

      <div
        className="rise d5"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--spacing-tight)",
        }}
      >
        {SKILLS.map((s) => (
          <span key={s} className="tag tag--skill">
            {s}
          </span>
        ))}
      </div>

      <div className="section-head rise d6" style={{ marginTop: "var(--spacing-layout)" }}>
        <h2 className="eyebrow">
          <span>
            Experience <span aria-hidden="true">//</span>
          </span>
        </h2>
      </div>

      <div className="about-experience rise d6">
        {EXPERIENCE.map((e) => (
          <div key={e.company + e.period} className="about-experience__row">
            <div>
              <div className="about-experience__role">{e.role}</div>
              <div className="about-experience__company">{e.company}</div>
              {e.note && (
                <div className="about-experience__note">{e.note}</div>
              )}
            </div>
            <div className="about-experience__period">{e.period}</div>
          </div>
        ))}
      </div>

      <div className="dot-rule rise d7" aria-hidden="true" />

      <p className="bio-inline rise d7">
        Open to senior IC and staff roles, based in San Francisco.{" "}
        <a href="https://linkedin.com/in/riverromney" target="_blank" rel="noopener noreferrer">let's connect on LinkedIn</a>.
      </p>
    </div>
  );
}
