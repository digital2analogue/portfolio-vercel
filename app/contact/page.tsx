import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to senior IC and staff roles in design systems, B2B product, or fintech. Response within 24–48 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · River Romney",
    description:
      "Open to senior IC and staff roles in design systems, B2B product, or fintech.",
    url: "/contact",
  },
};

type ContactLink = {
  label: string;
  value: string;
  href: string;
  download?: string;
  external?: boolean;
};

const LINKS: ContactLink[] = [
  {
    label: "EMAIL",
    value: "contact@riverromney.com",
    href: "mailto:contact@riverromney.com",
  },
  {
    label: "LINKEDIN",
    value: "linkedin.com/in/riverromney",
    href: "https://linkedin.com/in/riverromney",
    external: true,
  },
  {
    label: "RESUME",
    value: "Romney_River_Resume.pdf",
    href: "/Romney_River_Resume.pdf",
    download: "Romney_River_Resume.pdf",
  },
];

export default function ContactPage() {
  return (
    <div className="column">
      <section className="hero">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">01</span>&nbsp;/&nbsp;CONTACT
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ cat ./contact.md
          </div>
        </div>

        <h1 className="display rise d2">
          Let&apos;s <em>talk</em>.
        </h1>

        <p className="lede rise d3">
          Open to senior IC and staff roles in design systems, B2B product, or
          fintech. Also happy to talk about your hard design problem.
        </p>

        <div className="single-status rise d4">
          <span className="status-dot" aria-hidden="true">●</span>
          &nbsp;<span className="single-status__v">
            Available for new opportunities
          </span>
          <span className="single-status__sep" aria-hidden="true">·</span>
          <span>Response within 24–48h</span>
        </div>
      </section>

      <div className="dot-rule rise d5" aria-hidden="true">
        · · · · · · · ·
      </div>

      <ul className="contact-list rise d6">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              className="contact-row"
              href={l.href}
              {...(l.download !== undefined && { download: l.download })}
              {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <span className="contact-row__label">{l.label}</span>
              <span className="contact-row__value">
                {l.value}
                <span aria-hidden="true"> →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
