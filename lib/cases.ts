export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  company: string;
  year: string;
  role: string;
  tags: string[];
  summary: string;
  metrics: string[];
  status: string;
  /** Optional override for the listing link target. When set, the entry
   *  links here instead of the standard /work/[slug] detail page. Use for
   *  portfolio entries that point to a live artifact rather than a writeup. */
  href?: string;
};

export const CASES: CaseStudy[] = [
  {
    slug: "c1-decision-engine",
    index: "01",
    title: "Decision Engine",
    company: "Capital One",
    year: "2024 – 2025",
    role: "Principal UI/UX Designer, Design Systems",
    tags: ["Design Systems", "Fintech", "Compliance"],
    summary:
      "Replaced spreadsheet-driven policy workflows with a modular, compliance-ready decision engine — enabling non-technical stakeholders to own complex rule logic without engineering support.",
    metrics: ["~30% improvement in accessibility compliance"],
    status: "COMPLETE",
  },
  {
    slug: "ot-design-system",
    index: "02",
    title: "OpenTable's OTKit Design System",
    company: "OpenTable",
    year: "2022 – 2024",
    role: "Lead Product Designer, Design Systems - Product Owner",
    tags: ["Design Systems", "Tokens", "Multi-platform"],
    summary:
      "Built and scaled OpenTable's design system — establishing shared tokens, component patterns, and contribution workflows across web and native platforms.",
    metrics: ["1 system → web + native", "Cross-platform token adoption", "Reduced design/eng drift"],
    status: "COMPLETE",
  },
  {
    slug: "ot-reservations",
    index: "03",
    title: "Reservation Redesign",
    company: "OpenTable",
    year: "2019 – 2022",
    role: "Design Systems Lead & Product Partner",
    tags: ["Product Design", "Design Systems", "Enterprise UX"],
    summary:
      "Improved the restaurant reservation workflow — better hierarchy and scannability without sacrificing the information density power users depend on.",
    metrics: [
      "Modular card-based architecture",
      "Shared components across web + native",
      "Zero data loss or regressions",
    ],
    status: "COMPLETE",
  },
  {
    slug: "system",
    index: "04",
    title: "Parsimony, an Agentic Design System",
    company: "Personal",
    year: "2026",
    role: "Designer & Design Engineer",
    tags: ["Design Systems", "Design Tokens", "Agentic / AI", "Web Components"],
    summary:
      "A cross-site design system built to be used by agents as much as by people: one source of truth, from DTCG tokens through framework-agnostic components to an MCP server an agent can read and lint against before it writes any UI.",
    metrics: [
      "21 components, 4 brands, 1 source",
      "MCP server: read + lint the system",
      "Code Connect: design ↔ code, two-way",
    ],
    status: "LIVE · EVOLVING",
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find((c) => c.slug === slug);
}
