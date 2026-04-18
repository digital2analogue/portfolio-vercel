export type CaseStudy = {
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
    index: "01",
    title: "Decision Engine",
    company: "Capital One",
    year: "2023",
    role: "Principal Designer",
    tags: ["Design Systems", "Fintech", "Compliance"],
    summary:
      "Replaced spreadsheet-driven policy workflows with a modular, compliance-ready decision engine — enabling non-technical stakeholders to own complex rule logic without engineering support.",
    metrics: ["↓ 60% time-to-policy-change", "↑ 3 teams unblocked", "0 compliance gaps at launch"],
    status: "COMPLETE",
  },
  {
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
];
