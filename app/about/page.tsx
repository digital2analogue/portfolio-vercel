import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Principal Designer with ten years in design systems infrastructure, decision tooling, and compliance-heavy B2B. Based in San Francisco; taking new work.",
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
    role: "Principal UI/UX Designer, Design Systems",
    company: "Capital One",
    period: "2024 – 2025",
  },
  {
    role: "Lead Product Designer, Design Systems",
    company: "OpenTable",
    period: "2019 – 2024",
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

      <div className="dot-rule rise d3" aria-hidden="true">
        · · · · · · · ·
      </div>

      <div className="about-prose rise d4">
        <p>
          I&apos;m a Principal Designer with ten years specializing in complex
          B2B systems — <em>design systems infrastructure, decision tooling,</em>{" "}
          and the compliance-heavy surfaces enterprise teams rely on daily.
        </p>
        <p>
          My work lives at the intersection of <em>policy, data, and enterprise
          UX</em>. I care about making the invisible legible — surfacing the
          rules, states, and edge cases that software usually buries. The best
          design systems work looks quiet on the surface and holds up under
          real pressure.
        </p>
        <p>
          I bring a systems-first mindset to every project. I&apos;m as fluent
          architecting a component library as I am co-authoring a product
          brief, running a research sprint, or negotiating token governance
          with engineering leads.
        </p>
      </div>

      <div className="section-head rise d5" style={{ marginTop: "var(--primitive-space-3xl)" }}>
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
          gap: "var(--primitive-space-xs)",
        }}
      >
        {SKILLS.map((s) => (
          <span key={s} className="tag">
            {s}
          </span>
        ))}
      </div>

      <div className="section-head rise d6" style={{ marginTop: "var(--primitive-space-3xl)" }}>
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
            </div>
            <div className="about-experience__period">{e.period}</div>
          </div>
        ))}
      </div>

      <div className="dot-rule rise d7" aria-hidden="true">
        · · · · · · · ·
      </div>

      <p className="bio-inline rise d7">
        Based in San Francisco; <span className="accent">taking new work</span>.
      </p>
    </div>
  );
}
