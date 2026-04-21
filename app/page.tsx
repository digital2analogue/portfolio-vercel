import Link from "next/link";
import { CASES } from "@/lib/cases";

export default function IndexPage() {
  return (
    <div className="column">
      <section className="hero">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">01</span>&nbsp;/&nbsp;MASTHEAD
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ whoami
          </div>
          <div>
            <span className="hero__term-slash" aria-hidden="true">// </span>
            <span className="hero__term-ans">River — Principal Designer</span>
          </div>
          <div>
            <span className="hero__term-slash" aria-hidden="true">// </span>
            Design systems. Complex B2B. Compliance-heavy fintech.
            <span className="cursor" aria-hidden="true" />
          </div>
        </div>

        <h1 className="display rise d2">
          Product design <em>for&nbsp;systems</em> that scale.
        </h1>

        <p className="lede rise d3">
          I design decision tooling, compliance surfaces, and design systems at
          the intersection of policy, data, and enterprise UX. Currently{" "}
          <span className="accent">open to senior IC and staff roles</span>.
        </p>

        <div className="single-status rise d4">
          <span className="status-dot" aria-hidden="true">●</span>
          &nbsp;<span className="single-status__v">Open to work</span>
          <span className="single-status__sep" aria-hidden="true">·</span>
          <span>Remote / US</span>
          <span className="single-status__sep" aria-hidden="true">·</span>
          <span>Updated 2026-04-18</span>
        </div>
      </section>

      <div className="dot-rule rise d5" aria-hidden="true">
        · · · · · · · ·
      </div>

      <div className="section-head rise d5">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">02</span>&nbsp;/&nbsp;WORK
        </span>
        <h2 className="eyebrow">
          <span>
            Selected Work <span aria-hidden="true">//</span>
          </span>
          <span className="eyebrow__italic">
            a small number of large problems
          </span>
        </h2>
      </div>

      <ul className="cases">
        {CASES.map((c, i) => (
          <li key={c.index}>
            <Link
              className={`case rise d${6 + i}`}
              href={`/work/${c.slug}`}
            >
              <span className="case__anchor" aria-hidden="true">
                case<span className="accent">/{c.index}</span>
              </span>
              <span className="case__idx" aria-hidden="true">
                {c.index}
              </span>
              <div>
                <div className="case__title">
                  <em>{c.title}</em>
                </div>
                <div className="case__sub">
                  {c.company} · {c.role}
                </div>
              </div>
              <span className="case__year">
                {c.year}<span aria-hidden="true"> →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
