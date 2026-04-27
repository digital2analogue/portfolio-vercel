export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; alt: string; caption?: string; src?: string }
  | { type: "quote"; text: string }
  | { type: "note"; text: string }
  | { type: "hr" }
  | { type: "meta"; rows: [string, string][] };

export type CaseContent = {
  slug: string;
  title: string;
  scope: string;
  timeline: string;
  blocks: Block[];
};

export const CASE_CONTENT: Record<string, CaseContent> = {
  "c1-decision-engine": {
    slug: "c1-decision-engine",
    title: "Designing a Scalable Decision Engine for Enterprise Policy",
    scope: "System strategy, component architecture, governance",
    timeline: "5 months",
    blocks: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "At Capital One, I led design systems strategy for a scalable decision-engine interface supporting analysts in compliance-sensitive, high-stakes environments. The work focused on transforming fragmented, spreadsheet-driven workflows into a modular, system-aligned interface that balanced speed, accuracy, and accessibility.",
      },
      {
        type: "note",
        text: "Note: Details have been intentionally abstracted to respect confidentiality while preserving decision-making and impact.",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Role", "Design Systems Lead"],
          ["Scope", "System strategy, component architecture, governance"],
          ["Team", "2 designers, 2 PMs, engineering leads"],
          ["Timeline", "5 months"],
        ],
      },
      { type: "hr" },
      {
        type: "image",
        alt: "Credit Line Decisioning Model — the rules-table interface Capital One analysts use to manage consumer-lending approval rules",
        src: "/projects/images/01_hero_dark.png",
      },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Analysts relied on a patchwork of spreadsheets and inconsistent UI patterns to define and manage complex decision logic. This resulted in:",
      },
      {
        type: "ul",
        items: [
          "High cognitive load during rule creation",
          "Increased risk of error in critical workflows",
          "Inconsistent accessibility support",
          "Slow onboarding and poor pattern reuse across teams",
        ],
      },
      {
        type: "p",
        text: "The core issue wasn't missing features — it was **structural ambiguity**.",
      },
      {
        type: "image",
        alt: "Before and after: spreadsheet workflow versus the decision engine table",
        src: "/projects/images/c1-decision-engine-before-after.png",
      },
      { type: "hr" },
      { type: "h2", text: "Constraints" },
      {
        type: "ul",
        items: [
          "Compliance-sensitive domain with low tolerance for error",
          "Legacy interaction patterns deeply embedded in daily workflows",
          "Multiple teams extending shared patterns",
          "Need for incremental migration rather than a full rebuild",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Strategy" },
      {
        type: "p",
        text: "Instead of redesigning screens, I focused on **establishing a clear system hierarchy** that could scale across use cases and teams.",
      },
      { type: "p", text: "The approach:" },
      {
        type: "ul",
        items: [
          "Define a progression from tokens → core components → reusable patterns",
          "Encapsulate complexity rather than exposing it",
          "Treat adoption and governance as design problems, not enforcement problems",
        ],
      },
      {
        type: "p",
        text: "This allowed teams to reason about complex logic consistently while retaining flexibility.",
      },
      { type: "hr" },
      { type: "h2", text: "From Fragmentation to Modular Workflows" },
      {
        type: "p",
        text: "We replaced spreadsheet-style interfaces with modular workflows that made logic explicit and predictable.",
      },
      {
        type: "image",
        alt: "Decision engine rules table — full view with five policy rule rows",
        src: "/projects/images/c1-decision-engine-hero.png",
      },
      { type: "h3", text: "Key decisions" },
      {
        type: "ul",
        items: [
          "Centralized a shared component library as the single source of truth",
          "Defined repeatable interaction patterns for common analyst tasks",
          "Created a migration roadmap aligned to system maturity",
        ],
      },
      {
        type: "p",
        text: "The onboarding flow walked analysts through a three-step setup on a single page — choosing an outcome type, naming the model, and selecting the data elements it could evaluate. Each step was scoped to a single decision, reducing cognitive load before reaching the main interface.",
      },
      {
        type: "image",
        alt: "Full onboarding flow — all three setup steps visible on a single scrollable page",
        src: "/projects/images/c1-decision-engine-onboarding-full.png",
      },
      {
        type: "image",
        alt: "Step 1 — Assign an outcome type for the ruleset: Decline, Assign Credit Limit, Require Action, Award Rewards, and more",
        src: "/projects/images/c1-decision-engine-onboarding-step1.png",
      },
      {
        type: "image",
        alt: "Step 2 — Name the model and add a description before building rules",
        src: "/projects/images/c1-decision-engine-onboarding-step2.png",
      },
      {
        type: "image",
        alt: "Step 3 — Select data elements from a searchable list; a preview panel shows attribute metadata on the right",
        src: "/projects/images/c1-decision-engine-onboarding-step3.png",
      },
      { type: "hr" },
      { type: "h2", text: "Component Deep Dive: Rule Cell (Conceptual)" },
      {
        type: "p",
        text: "One critical interaction pattern encapsulated complex decision logic into a single, reusable unit.",
      },
      {
        type: "image",
        alt: "Decision Engine component system — data attribute badges, outcome badges, operators, and row states as reusable, tokenized primitives",
        src: "/projects/images/04_component_system_dark.png",
      },
      {
        type: "image",
        alt: "Rule row anatomy — annotated breakdown of each interactive element in a rule row",
        src: "/projects/images/c1-decision-engine-rule-row-anatomy.png",
      },
      { type: "h3", text: "Design goals" },
      {
        type: "ul",
        items: [
          "Surface upstream dependencies and validation states",
          "Reduce interaction cost for defining logic",
          "Support both novice and expert analyst behaviors",
        ],
      },
      {
        type: "p",
        text: "Each rule row maps a data attribute to an operator, a threshold value, and a decision outcome. The inline edit model — badge tap to swap attribute, dropdown for operator, direct input for value — eliminated the modal-heavy workflows analysts had been tolerating.",
      },
      {
        type: "image",
        alt: "Data element selector — step 3 split panel showing available attributes and metadata preview",
        src: "/projects/images/c1-decision-engine-data-element-selector.png",
      },
      { type: "h3", text: "Impact" },
      {
        type: "ul",
        items: [
          "Reduced interaction steps by ~63%",
          "Improved task-completion success in discovery testing",
          "Lowered error rates during rule creation",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Accessibility as a System Lever" },
      {
        type: "p",
        text: "Accessibility improvements were embedded at the system level rather than treated as retrofits.",
      },
      { type: "p", text: "Outcomes included:" },
      {
        type: "ul",
        items: [
          "~30% improvement in accessibility compliance",
          "Clearer focus states and keyboard navigation",
          "More predictable interaction behavior across components",
        ],
      },
      {
        type: "p",
        text: "Accessibility became a forcing function for better structure and clarity.",
      },
      { type: "hr" },
      { type: "h2", text: "Outcomes & Impact" },
      {
        type: "ul",
        items: [
          "Unified interaction patterns across a critical enterprise workflow",
          "Faster analyst task completion in usability testing",
          "Reduced design and QA overhead through shared tokens and components",
          "Established a scalable foundation for future platform growth",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Next Iterations" },
      {
        type: "ul",
        items: [
          "Expand the component library to support new data interaction models",
          "Refine token architecture for faster theming and dark mode support",
          "Deepen async contribution rituals to scale governance sustainably",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "In complex enterprise systems, clarity is a performance feature. This work reinforced that scalable UX isn't about simplifying problems — it's about **making complexity legible**.",
      },
    ],
  },
  "ot-design-system": {
    slug: "ot-design-system",
    title: "Building OTKit: From Drift to Discipline",
    scope: "iOS, Android, Web",
    timeline: "2022–2023",
    blocks: [
      {
        type: "image",
        alt: "OTKit Design System v3.2 overview — color palette, semantic tokens, and component library spanning iOS, Android, and web",
        caption: "OTKit at a glance — the system River led to consolidate fragmented patterns across iOS, Android, and web.",
        src: "/projects/images/ot-design-system-hero.png",
      },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "OTKit is OpenTable's design system supporting Restaurant and Diner products across iOS, Android, and web. When I took ownership, the system existed — but lacked cohesion, governance, and trust. Design drift, fragmented sources of truth, and inconsistent adoption were slowing teams down and introducing costly QA issues.",
      },
      { type: "p", text: "My mandate was not just to redesign components." },
      {
        type: "p",
        text: "It was to **turn a drifting system into an operational platform** teams actually relied on.",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Role", "Design Systems Lead"],
          ["Scope", "iOS, Android, Web"],
          ["Team", "6 product teams"],
        ],
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      { type: "p", text: "Design system drift was expensive and invisible." },
      { type: "p", text: "Research through user surveys and 1:1 interviews revealed:" },
      {
        type: "ul",
        items: [
          "Three competing sources of truth (Figma, Storybook, internal token sites)",
          "Visual inconsistencies across products and platforms",
          "Late-stage QA bugs tied directly to token and component mismatch",
        ],
      },
      {
        type: "image",
        alt: "Screenshots of multiple Storybooks and documentation source-of-truth websites before consolidation",
        caption: "Design system drift across OpenTable products before consolidation.",
        src: "/projects/images/cs-legacy-sot.png",
      },
      {
        type: "quote",
        text: "We estimated the cost of drift at ~$237K/year in inefficiency and rework.",
      },
      { type: "hr" },
      { type: "h2", text: "User Research" },
      {
        type: "p",
        text: "We established a research strategy focused on understanding the challenges faced by design, product, and engineering teams. A survey of 37 respondents across OpenTable revealed the depth of the problem:",
      },
      { type: "h3", text: "One-off component creation" },
      {
        type: "p",
        text: "**100%** of iOS designers said they were creating new or one-off components often or occasionally, compared to **60%** of web designers across both Restaurant and Diner teams. iOS teams suffered the most — which made sense given we had a much more mature web component library (Buffet) but nothing comparable for native.",
      },
      {
        type: "quote",
        text: "I think iOS lacks the rich component system that web has (Buffet), and that poses some challenges for us. — Restaurant iOS engineer",
      },
      { type: "h3", text: "Time spent clarifying styling during release" },
      {
        type: "p",
        text: "**75% of Restaurant web designers** reported spending **4–8 rounds** clarifying styling with engineering during each release cycle. Meanwhile, **100% of Diner web designers** reported only **0–3 rounds**. Cross-functional Restaurant teams were spending significantly more time reconciling their style guide with designers and developers.",
      },
      { type: "h3", text: "Consolidating research" },
      {
        type: "p",
        text: "We ran 1:1 interviews and remote collaborative brainstorms using FigJam and Dovetail. The main insight was clear: designers and engineers often had the **same problem** — unclear documentation, scattered sources of truth, and no shared language for components. Most folks knew what colors and styles to use, but much of the style guide lived in designers' heads rather than in a system.",
      },
      {
        type: "quote",
        text: "We have a ton of legacy styles and pages on our iOS apps and it's always a push and pull on when and how to update those. — Cris, designer on Restaurant product",
      },
      { type: "hr" },
      { type: "h2", text: "Constraints" },
      { type: "p", text: "The system had to evolve without stopping product delivery." },
      {
        type: "ul",
        items: [
          "Six product and platform teams shipping in parallel",
          "Legacy UI patterns deeply embedded in production",
          "Cross-platform requirements (iOS, Android, Web)",
        ],
      },
      {
        type: "image",
        alt: "Screenshot of Restaurant app showing inconsistent, inaccessible components on web using transparent colors",
        caption: "Inconsistent and inaccessible components on web.",
        src: "/projects/images/cs-interface-opacity.png",
      },
      { type: "hr" },
      { type: "h2", text: "Strategy" },
      {
        type: "p",
        text: "To stop drift without breaking teams, I focused on **foundations first**, then scaled upward:",
      },
      {
        type: "ul",
        items: [
          "Tokens before components",
          "Accessible color and typography foundations",
          "Documentation as a first-class system artifact",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Foundations: Tokens, Type, Icons" },
      {
        type: "p",
        text: "These foundational changes unlocked consistency without forcing large rewrites, making adoption possible across active codebases.",
      },
      { type: "h3", text: "Color tokens" },
      {
        type: "ul",
        items: [
          "Audited and documented all existing colors cross-platform",
          "Deprecated legacy redundant colors",
          "Rebuilt the color system around accessible, semantic tokens",
          "Built mixed light/dark theming for existing UI",
        ],
      },
      {
        type: "p",
        text: "This resolved cases where critical actions appeared disabled, improved cross-platform parity, and allowed teams to adopt the system without rewriting existing UI.",
      },
      {
        type: "image",
        alt: "Token architecture — primitives flow into semantic tokens, which compose into component tokens scoped per UI element",
        caption: "Primitive → Semantic → Component. The three-tier contract that made OTKit's theming scale without forking.",
        src: "/projects/images/ot-design-system-detail.png",
      },
      {
        type: "image",
        alt: "Screenshot of semantic color token documentation",
        src: "/projects/images/cs-semantic-color-documentation.png",
      },
      {
        type: "image",
        alt: "Screenshot of semantic color token migration tool",
        caption:
          "Establishing semantic tokens created a single source of truth across platforms and reduced downstream inconsistencies.",
        src: "/projects/images/casestudy-otkit-colormappingtool.png",
      },
      { type: "h3", text: "System thinking in action: Table Statuses" },
      {
        type: "p",
        text: "A real product use case validated the color system early. The Table Statuses feature needed color-coded indicators for reservation states — and the product team initially proposed 21+ new colors. By collaborating with the design system team, we satisfied the project requirements using the existing accent palette, reducing color sprawl while shipping on time. It was a win-win: the product got what it needed, and the system stayed coherent.",
      },
      { type: "h3", text: "Contextual typography" },
      { type: "p", text: "The existing type system was a one-size-fits-all scale that:" },
      {
        type: "ul",
        items: [
          "Was not mobile-optimized",
          "Encouraged incorrect font usage in native apps",
          "Had ballooned to 39 fonts in the codebase",
        ],
      },
      {
        type: "image",
        alt: "Diagram showing how contextual typography scales across platforms",
        caption: "Diagram illustrating how contextual typography scales across platforms",
        src: "/projects/images/casestudy-otkit-diner-ab-test.png",
      },
      { type: "h3", text: "Solution" },
      {
        type: "ul",
        items: [
          "Introduced a contextual typography scale by platform",
          "Defined size, weight, and family per context",
          "Added support for Apple Dynamic Type",
        ],
      },
      { type: "h3", text: "Impact" },
      {
        type: "p",
        text: "A/B testing showed a **+2.19% increase in diner bookings** (+600 weekly net bookers) on pages using dynamic type.",
      },
      {
        type: "image",
        alt: "Animated gif of dynamic text sizing from small to large on iOS iPhone based on user accessibility settings",
        caption: "Animation of dynamic text sizing implemented on iOS",
        src: "/projects/images/casestudy-otkit-dynamic-text.gif",
      },
      {
        type: "image",
        alt: "Contextual typography scale showing size, weight, and family defined per platform context",
        caption:
          "The contextual type scale reduced 39 font variants to a purposeful, platform-aware system.",
        src: "/projects/images/casestudy-otkit-typescale.png",
      },
      { type: "h3", text: "Icon system" },
      {
        type: "ul",
        items: [
          "Introduced shape-based icon grids",
          "Unified keyshapes for indicators",
          "Centralized icon repositories across platforms",
          "Added SF Symbol parity for accessibility",
        ],
      },
      {
        type: "image",
        alt: "Animation of shape-based icon creation grid with keyshapes",
        src: "/projects/images/icon_grid_animated.gif",
      },
      {
        type: "image",
        alt: "Screenshot of icon creation guidelines on documentation site",
        src: "/projects/images/casestudy-otkit-icons-splash.png",
      },
      {
        type: "p",
        text: "This enabled a **searchable, themeable SVG system** shared across native and web teams, reducing duplication and improving accessibility parity.",
      },
      {
        type: "image",
        alt: "Screenshot of searchable icon library on documentation site",
        src: "/projects/images/casestudy-otkit-icon-library.png",
      },
      {
        type: "image",
        alt: "Screenshot showing SF Symbol parity mapping across OTKit iconography",
        caption:
          "SF Symbol parity ensured accessibility-compliant icon behavior on iOS without duplicating icon work.",
        src: "/projects/images/casestudy-otkit-sf-symbols-icons.png",
      },
      { type: "hr" },
      { type: "h2", text: 'Brand Evolution: "Black Is the New Red"' },
      {
        type: "p",
        text: "OpenTable operates in an industry dominated by red and orange. Partnering closely with Brand, we translated a premium direction into a **tokenized theming architecture** rather than one-off visual treatments.",
      },
      {
        type: "image",
        alt: "Animation showing updated OTKit brand and theme on iPhone app",
        src: "/projects/images/casestudy-otkit-opentable-new-brand-app.gif",
      },
      {
        type: "image",
        alt: "Animation showing updated OTKit iconography shared by Debby on LinkedIn",
        src: "/projects/images/casestudy-otkit-opentable-icons-debby-linkedin.gif",
      },
      { type: "p", text: "This allowed brand evolution without breaking product consistency. Namely:" },
      {
        type: "ul",
        items: [
          "Two new font families",
          "A refreshed color palette",
          "Visual distinction for Iconic restaurants",
        ],
      },
      {
        type: "p",
        text: "The key insight: by encoding brand decisions as token values rather than hardcoded styles, the system could absorb a major brand shift without requiring teams to rewrite their components.",
      },
      { type: "hr" },
      { type: "h2", text: "Theming in Practice" },
      {
        type: "p",
        text: "The tokenized architecture made it possible to deliver two visually distinct experiences from a single component library.",
      },
      { type: "h3", text: "Mass Theme" },
      {
        type: "p",
        text: "The Mass theme serves OpenTable's core restaurant audience. Editorial in feel, it uses a two-column structure inspired by e-commerce — booking surfaced immediately, decisions guided with minimal visual noise. Every component follows the same token-driven pattern, so new features land consistently without bespoke design decisions at the component level.",
      },
      { type: "h3", text: "Iconic Theme" },
      {
        type: "p",
        text: "For OpenTable's premium Iconic restaurant tier, the system delivered a distinct but coherent experience. Full-bleed photography, dark wine-inspired time slot styling, and sticky booking flows communicated prestige without sacrificing usability. The same underlying tokens and components powered both themes — no fork required, just a different set of token values.",
      },
      { type: "hr" },
      { type: "h2", text: "Outcomes & Impact" },
      { type: "p", text: "Over the course of the engagement, OTKit delivered measurable ROI:" },
      {
        type: "ul",
        items: [
          "25% reduction in QA time",
          "≈ $59K/year reclaimed in developer time",
          "50% fewer Figma libraries",
          "Unified design language across 6 teams",
          "Supported a full OpenTable brand refresh",
        ],
      },
      {
        type: "image",
        alt: "OTKit adoption across teams and platforms",
        caption: "OTKit scaled across 6 product teams, supporting iOS, Android, and web simultaneously.",
      },
      { type: "hr" },
      { type: "h2", text: "What Made This Work" },
      {
        type: "p",
        text: "OTKit's adoption didn't happen through enforcement. We built a network of **design ambassadors** — designers embedded in product teams who championed the system locally and surfaced friction back to the core team. This created a feedback loop that made the system more useful over time.",
      },
      {
        type: "image",
        alt: "Photo from OTKit design ambassadorship program",
        caption: "Design ambassadors in product teams acted as system advocates and real-world feedback channels.",
        src: "/projects/images/casestudy-otkit-ambassadorship.png",
      },
      {
        type: "p",
        text: "Documentation was treated as a **first-class deliverable**, not an afterthought. Component specs, token definitions, and usage guidelines were kept in sync with engineering. We ran regular office hours, live demos, and shipped a system newsletter to keep teams informed and engaged.",
      },
      {
        type: "image",
        alt: "Screenshot of the OTKit system newsletter",
        caption: "The OTKit newsletter kept teams aligned on system changes, deprecations, and new patterns.",
        src: "/projects/images/casestudy-otkit-newsletter.png",
      },
      {
        type: "quote",
        text: "I wanted to directly reach out and thank you for your feedback in today's session. All of the links and resources you shared were incredibly helpful. — Stephanie, Restaurant Design Ambassador",
      },
      {
        type: "quote",
        text: "I wanted to mention how helpful it has been having River support me on the design systems front. His depth of knowledge has been invaluable for our team. — Jordon, Restaurant Design Ambassador",
      },
      {
        type: "p",
        text: "Trust was built through follow-through. When teams reported issues, we responded quickly. When we made breaking changes, we migrated them. That responsiveness turned skeptics into advocates.",
      },
      { type: "hr" },
      { type: "h2", text: "Learnings" },
      { type: "h3", text: "Challenge: Lack of native Figma support for design tokens" },
      {
        type: "p",
        text: "We started work on the foundations before Figma released Variables. This meant we initially had to manage tokens through workarounds — naming conventions, separate documentation, and manual syncing. When Variables shipped, we migrated quickly, but the gap cost us early momentum.",
      },
      {
        type: "p",
        text: "**What I'd do next time:** More upfront communication around the limitations of tooling and clearer expectations about what would change once better tooling arrived. Teams need to understand the 'why' behind interim solutions.",
      },
      { type: "h3", text: "Challenge: Communicating with remote teams" },
      {
        type: "p",
        text: "Working in a remote setting with teams distributed across North America, Europe, and Asia created real communication challenges. Updates got lost, context didn't travel well across time zones, and synchronous meetings couldn't cover everyone.",
      },
      {
        type: "p",
        text: "**What I'd do next time:** Lean harder into async from the start — more recorded video demos, tech talks, dedicated Slack Q&A channels, and newsletters. The newsletter ended up being one of our most effective tools, and I wish we'd started it earlier.",
      },
      { type: "h3", text: "Challenge: Scaling myself" },
      {
        type: "p",
        text: "Design systems work often got sidelined into supporting feature work that needed system alignment. The constant pull between system-level thinking and product-level support was real, and without clear boundaries, it was easy to become a bottleneck.",
      },
      {
        type: "p",
        text: "**What I'd do next time:** Be clearer upfront about the design system team's role and responsibility relative to product work. The Ambassadorship model helped with this, but establishing those boundaries earlier would have preserved more time for foundational work.",
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "The success of OTKit wasn't the components — it was the shift in mindset. The system became something teams relied on, not something they worked around.",
      },
      { type: "p", text: "That's the difference between a library and a platform." },
    ],
  },
  "ot-reservations": {
    slug: "ot-reservations",
    title: "Modernizing Restaurant Reservations Without Losing Density",
    scope: "UX strategy, system alignment, component modeling",
    timeline: "10 weeks",
    blocks: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "I led the redesign of OpenTable's restaurant reservation details flow — a business-critical interface used daily by restaurant operators. The work modernized a dense, legacy experience while preserving information richness, improving usability, and aligning the product with the evolving OTKit design system.",
      },
      {
        type: "p",
        text: "This project demonstrates how design systems can drive **practical product outcomes**, not just visual consistency.",
      },
      {
        type: "image",
        alt: "Reservation Details — before-and-after comparison. Legacy flat layout on the left; the redesigned card-based hierarchy on the right.",
        caption: "Before → After. Same information density, restructured for clarity under pressure.",
        src: "/projects/images/ot-reservations-hero.png",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Role", "Design Systems Lead, Product Partner"],
          ["Scope", "UX strategy, system alignment, component modeling"],
          ["Team", "3 designers, 6 engineers, 2 PMs"],
          ["Timeline", "10 weeks"],
        ],
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Reservation details had become a dumping ground for years of accumulated features.",
      },
      { type: "p", text: "The experience was:" },
      {
        type: "ul",
        items: [
          "Dense and visually fragmented",
          "Difficult to scan under time pressure",
          "Inconsistent across platforms",
          "Costly to maintain due to distributed ownership across engineering teams",
        ],
      },
      {
        type: "p",
        text: "Despite its importance, it had the **most legacy styling** in the product — making UX improvements slow and risky.",
      },
      {
        type: "image",
        alt: "Screenshot of legacy Reservation Details page before redesign",
        caption: "Legacy reservation details view. High density, low hierarchy, fragmented styling.",
        src: "/projects/images/ot-reservations-legacy-detail.png",
      },
      { type: "hr" },
      { type: "h2", text: "Constraints" },
      {
        type: "ul",
        items: [
          "Zero tolerance for data loss or behavioral regressions",
          "Heavy daily usage by restaurant staff",
          "Multiple engineering teams owning different parts of the flow",
          "Need to preserve information density while improving clarity",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Strategy" },
      {
        type: "p",
        text: "Rather than redesigning the page wholesale, we treated the reservation view as a **modular system problem**.",
      },
      { type: "p", text: "Key principles:" },
      {
        type: "ul",
        items: [
          "Preserve density, improve hierarchy",
          "Replace bespoke layouts with reusable system components",
          "Design once, scale across platforms",
        ],
      },
      {
        type: "p",
        text: "This allowed us to modernize the experience without disrupting established workflows.",
      },
      {
        type: "image",
        alt: "Animation showing the modular card-based breakdown of the reservation details view",
        caption:
          "Each section of the reservation view mapped to a discrete system pattern, making the layout predictable for both users and engineers.",
        src: "/projects/images/cs-rest-modular-design.gif",
      },
      { type: "hr" },
      { type: "h2", text: "Solution: Modular, Card-Based Architecture" },
      {
        type: "p",
        text: "We restructured the reservation details view into a modular, card-based layout that:",
      },
      {
        type: "ul",
        items: [
          "Clarified information hierarchy",
          "Improved scannability under time pressure",
          "Enabled consistent behavior across mobile, tablet, and desktop",
          "Reduced one-off UI logic in engineering",
        ],
      },
      {
        type: "p",
        text: "Each card mapped to a system pattern, allowing teams to iterate safely and predictably.",
      },
      {
        type: "image",
        alt: "Redesigned Reservation Details in OpenTable's Restaurant Manager — booking summary, guest profile, special requests, recent visits, and availability on a single desktop surface",
        caption: "Final Restaurant Manager view — every section of the reservation mapped to a reusable OTKit card.",
        src: "/projects/images/ot-reservations-detail.png",
      },
      {
        type: "image",
        alt: "Animation of the updated iOS Restaurant app showing modular layout and design system components",
        caption:
          "The modular card architecture in action — each zone behaves predictably and scales responsively across screen sizes.",
        src: "/projects/images/ot-reservations-ios-modular-layout.gif",
      },
      { type: "h3", text: "Modular ecosystem" },
      {
        type: "image",
        alt: "Screenshot of the redesigned Guest Profile component in the Back of House web view",
        src: "/projects/images/ot-reservations-guest-profile-boh.png",
      },
      {
        type: "image",
        alt: "Close-up screenshot of the Guest Profile component showing structured guest data in Back of House",
        caption: "The new Guest Profile component made guest data easily viewable in Back of House",
        src: "/projects/images/ot-reservations-guest-profile-boh-detail.png",
      },
      { type: "hr" },
      { type: "h2", text: "System Alignment" },
      { type: "p", text: "This work became a proving ground for OTKit in real product conditions." },
      { type: "p", text: "We:" },
      {
        type: "ul",
        items: [
          "Applied shared tokens and components across platforms",
          "Validated cross-platform typography and spacing decisions",
          "Reduced reliance on custom overrides",
          "Tightened the feedback loop between system and product teams",
        ],
      },
      { type: "p", text: "The result was faster iteration with fewer regressions." },
      {
        type: "image",
        alt: "Screenshot of OTKit documentation site showing how to implement inline theming for legacy screens",
        caption:
          "Support for inline theming was implemented to support mixed legacy theming before full light/dark theme were prioritized",
        src: "/projects/images/ot-reservations-inline-theming.png",
      },
      {
        type: "image",
        alt: "Screenshot of OTKit color token references inside iOS app",
        caption: "OTKit color tokens",
        src: "/projects/images/ot-reservations-color-tokens-native.png",
      },
      { type: "hr" },
      { type: "h2", text: "Outcomes & Impact" },
      {
        type: "ul",
        items: [
          "Modernized a core operational workflow without sacrificing density",
          "Improved readability and hierarchy in a high-stakes, time-sensitive interface",
          "Reduced QA friction by replacing bespoke UI with shared system patterns",
          "Strengthened trust in OTKit through visible, high-traffic product adoption",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "Designing for restaurant operators reinforced that usability isn't about simplification — it's about **clarity under pressure**.",
      },
      {
        type: "p",
        text: "This work showed how design systems can enable meaningful product improvements without disrupting workflows that teams depend on daily.",
      },
    ],
  },
};
