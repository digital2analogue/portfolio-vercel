import type { Metadata } from "next";
import Link from "next/link";
import { CASES } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected case studies on design systems, decision tooling, and compliance-heavy B2B — most recently at Capital One and OpenTable.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Work · River Romney",
    description:
      "Design systems, decision tooling, and compliance-heavy B2B work by River Romney.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <div className="column">
      <section className="hero" style={{ marginBottom: "var(--primitive-space-3xl)" }}>
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">01</span>&nbsp;/&nbsp;WORK
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ ls ./work/
          </div>
          <div>
            <span className="hero__term-slash" aria-hidden="true">// </span>
            <span className="hero__term-ans">{CASES.length} case studies</span>
          </div>
        </div>

        <h1 className="display rise d2">
          Case <em>studies</em>
        </h1>

        <p className="lede rise d3">
          A small selection of work at the intersection of policy, data, and
          enterprise UX. Each case opens into a full writeup.
        </p>
      </section>

      <div className="dot-rule rise d4" aria-hidden="true">
        · · · · · · · ·
      </div>

      <ul className="work-list rise d5">
        {CASES.map((c) => (
          <li key={c.slug}>
            <Link href={`/work/${c.slug}`} className="work-row">
              <div className="work-row__header">
                <span className="case__idx" aria-hidden="true">
                  {c.index}
                </span>
                <div>
                  <div className="case__sub">
                    {c.company} · {c.year} · {c.role}
                  </div>
                  <div className="case__title">
                    <em>{c.title}</em>
                  </div>
                </div>
                <span className="work-row__toggle" aria-hidden="true">
                  →
                </span>
              </div>
              <div className="work-row__body">
                <p className="work-row__summary">{c.summary}</p>

                <div className="work-row__label">Impact //</div>
                <div className="work-row__metrics">
                  {c.metrics.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>

                <div className="work-row__tags">
                  {c.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
