import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASES, getCase } from "@/lib/cases";
import { CASE_CONTENT } from "@/lib/caseContent";
import CaseBlocks from "@/components/CaseBlocks";

type Params = { slug: string };

// Pre-render every case at build time for SEO + fast first paint.
export function generateStaticParams(): Params[] {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCase(slug);
  const content = CASE_CONTENT[slug];
  if (!meta || !content) return {};

  const title = content.title;
  const description = meta.summary;
  const path = `/work/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${title} · River Romney`,
      description,
      url: path,
      authors: ["River Romney"],
      tags: meta.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · River Romney`,
      description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const meta = getCase(slug);
  const content = CASE_CONTENT[slug];

  if (!meta || !content) {
    notFound();
  }

  const currentIdx = CASES.findIndex((c) => c.slug === slug);
  const prev = currentIdx > 0 ? CASES[currentIdx - 1] : null;
  const next =
    currentIdx < CASES.length - 1 ? CASES[currentIdx + 1] : null;

  return (
    <div className="column">
      <Link href="/work" className="case-detail__back">
        <span aria-hidden="true">← </span>Back to work
      </Link>

      <section className="hero">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">{meta.index}</span>&nbsp;/&nbsp;CASE
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ cat ./work/
            {meta.slug}.md
          </div>
        </div>

        <div className="case-detail__meta-row rise d2">
          <span className="case-detail__index" aria-hidden="true">
            {meta.index}
          </span>
          <span className="case-detail__company-year">
            {meta.company} · {meta.year}
          </span>
        </div>

        <h1 className="display rise d2">{content.title}</h1>

        <p className="lede rise d3">{meta.summary}</p>

        <div className="case-detail__tags rise d4">
          {meta.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="case-detail__hero-meta rise d4">
          <CaseBlocks
            blocks={[
              {
                type: "meta",
                rows: [
                  ["Company", meta.company],
                  ["Role", meta.role],
                  ["Timeline", content.timeline],
                  ["Status", meta.status],
                ],
              },
            ]}
          />
        </div>
      </section>

      <div className="dot-rule rise d5" aria-hidden="true">
        · · · · · · · ·
      </div>

      <CaseBlocks blocks={content.blocks} />

      <nav
        className="case-detail__pager"
        aria-label="Case study pagination"
      >
        <div>
          {prev && (
            <Link
              href={`/work/${prev.slug}`}
              className="case-detail__pager-link"
            >
              <div className="case-detail__pager-label">
                <span aria-hidden="true">← </span>Previous
              </div>
              <div className="case-detail__pager-title">
                <em>{prev.title}</em>
              </div>
            </Link>
          )}
        </div>
        <div className="case-detail__pager-next">
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="case-detail__pager-link"
            >
              <div className="case-detail__pager-label">
                Next<span aria-hidden="true"> →</span>
              </div>
              <div className="case-detail__pager-title">
                <em>{next.title}</em>
              </div>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
