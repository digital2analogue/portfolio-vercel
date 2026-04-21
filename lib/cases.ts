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
    metrics: ["↓ 60% time-to-policy-change", "↑ 3 teams unblocked", "0 compliance gaps at launch"],
    status: "COMPLETE",
  },
  {
    slug: "ot-design-system",
    index: "02",
    title: "Design System",
    company: "OpenTable",
    year: "2021",
    role: "Principal Designer",
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
    year: "2022",
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
];

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find((c) => c.slug === slug);
}
