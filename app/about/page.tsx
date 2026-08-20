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
    note: "Kept building: design-systems research, and the first version of Parsimony.",
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

/* Each principle is evidenced by work on this site, and links to it. This
   section is the page carrying the "who is this person to work with" load —
   without a photo, that has to come from stated positions, not adjectives. */
const PRINCIPLES = [
  {
    n: "01",
    title: "Name the cost in dollars",
    body: (
      <>
        A system nobody funds is a hobby. I surveyed 37 people and priced
        drift at <em>≈$390K a year</em>. That number got the work funded.
      </>
    ),
    href: "/work/ot-design-system",
    cta: "OTKit",
  },
  {
    n: "02",
    title: "Adoption is advocacy, not enforcement",
    body: (
      <>
        You can&apos;t police six teams into a system. A designer–engineer
        pair per platform, one contribution path, and a release email people
        actually read did what mandates couldn&apos;t.
      </>
    ),
    href: "/work/ot-design-system",
    cta: "The ambassadorship program",
  },
  {
    n: "03",
    title: "Foundations first, because nothing pauses",
    body: (
      <>
        Real teams are always mid-flight. Build the layer they can adopt
        without a rewrite: tokens before components, accessibility before
        polish.
      </>
    ),
    href: "/work/ot-reservations",
    cta: "Reservations, shipped without regressions",
  },
  {
    n: "04",
    title: "Measure the claim, then publish the failure",
    body: (
      <>
        Assertions are cheap. &ldquo;Agents follow a system better when it&apos;s
        data&rdquo; became a real eval: <em>95% against 70%</em>. This site also
        ships a genuine WCAG failure rather than a flattering fake.
      </>
    ),
    href: "/work/system",
    cta: "Parsimony",
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
          enterprise UX.
        </p>
        <p>
          The work is making the invisible legible: the rules, states and edge
          cases software buries. Done well it looks quiet and holds under
          pressure.
        </p>
      </div>

      <div className="section-head rise d5" style={{ marginTop: "var(--spacing-layout)" }}>
        <h2 className="eyebrow">
          <span>
            How I work <span aria-hidden="true">//</span>
          </span>
          <span className="eyebrow__italic">four positions, each with receipts</span>
        </h2>
      </div>

      <ol className="principles rise d5">
        {PRINCIPLES.map((p) => (
          <li key={p.n} className="principle">
            <span className="principle__n" aria-hidden="true">{p.n}</span>
            <div>
              <h3 className="principle__title">{p.title}</h3>
              <p className="principle__body">{p.body}</p>
              <Link className="principle__link" href={p.href}>
                {p.cta} <span aria-hidden="true">→</span>
              </Link>
            </div>
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
