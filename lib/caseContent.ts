import type { DemoKey } from "@/components/demos/registry";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; alt: string; caption?: string; src?: string; naturalSize?: boolean; frame?: string }
  | { type: "video"; src: string; alt: string; caption?: string; poster?: string; naturalSize?: boolean }
  /** Hand-authored SVG diagram, inlined server-side (lib/diagrams.ts) and
   *  animated on scroll-in by DiagramBlock. `svg` is populated at render
   *  time — content authors only set `src` (the .svg under public/). */
  | { type: "diagram"; src: string; alt: string; caption?: string; svg?: string }
  | { type: "image-pair"; images: Array<{ alt: string; caption?: string; src?: string }> }
  | { type: "embed"; src: string; title: string; caption?: string; aspectRatio?: string; poster?: string }
  | { type: "outcome-demo"; caption?: string }
  | { type: "quote"; text: string }
  | { type: "note"; text: string }
  | { type: "hr" }
  | { type: "meta"; rows: [string, string][] }
  | { type: "stats"; items: Array<{ value: string; label: string }> }
  | { type: "demo"; demo: DemoKey; caption?: string; frameLabel?: string; surface?: "light" | "dark" };

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
        text: "Policy analysts at Capital One built complex decision logic in spreadsheets — rules copy-pasted between tabs, compliance constraints cross-referenced by hand. I led the design systems strategy that replaced that workflow with a modular, compliance-ready rules interface.",
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
        type: "stats",
        items: [
          { value: "8 → 3", label: "Clicks to a saved rule" },
          { value: "63%", label: "Shorter rule-creation path" },
          { value: "~30%", label: "Accessibility compliance lift" },
        ],
      },
      { type: "hr" },
      {
        type: "p",
        text: "The actual thing, before the write-up: a public-safe, runnable prototype. Drag a rule to reorder, flip an outcome, edit any cell — or open the [full onboarding flow](https://decisioning-table.vercel.app).",
      },
      {
        type: "embed",
        src: "https://decisioning-table.vercel.app/?demo=1",
        title: "Live Decision Model rules table — drag a rule to reorder, flip Approve/Deny, edit any cell",
        poster: "/projects/images/decisioning-table-rules.png",
        aspectRatio: "16 / 10",
        caption:
          "The live prototype — not a screenshot. Drag a rule by its handle to reorder, flip the Approve/Deny outcome, edit any cell. Reorder works on touch too.",
      },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "A patchwork of spreadsheets and inconsistent UI patterns made complex logic risky to author:",
      },
      {
        type: "ul",
        items: [
          "High cognitive load during rule creation",
          "Error-prone in critical workflows",
          "Inconsistent accessibility support",
          "Slow onboarding, little pattern reuse",
        ],
      },
      {
        type: "p",
        text: "The core issue wasn't missing features. It was **structural ambiguity**.",
      },
      {
        type: "image",
        alt: "Before: spreadsheet workflow used prior to the decision engine",
        src: "/projects/images/c1-decision-engine-before.png",
        naturalSize: true,
      },
      { type: "hr" },
      { type: "h2", text: "Constraints" },
      {
        type: "ul",
        items: [
          "Compliance-sensitive domain with low tolerance for error",
          "Legacy interaction patterns embedded in daily workflows",
          "Codebase used open-source Ant Design rather than Capital One's Gravity system",
          "Incremental migration, not a full rebuild",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Strategy" },
      {
        type: "p",
        text: "Instead of redesigning screens, I focused on **establishing a clear system hierarchy** that could scale across use cases and teams.",
      },
      {
        type: "image",
        alt: "After: the decision engine table interface",
        src: "/projects/images/c1-decision-engine-after.png",
        frame: "Decision engine · Rules table",
      },
      { type: "p", text: "The approach:" },
      {
        type: "ul",
        items: [
          "Tokens → core components → reusable patterns",
          "Encapsulate complexity rather than exposing it",
          "Treat adoption and governance as design problems, not enforcement problems",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "From Fragmentation to Modular Workflows" },
      {
        type: "p",
        text: "We replaced spreadsheet-style interfaces with modular workflows that made logic explicit and predictable.",
      },
      {
        type: "ul",
        items: [
          "One shared component library (Figma + Storybook) as the source of truth",
          "Repeatable interaction patterns for common analyst tasks",
          "A migration roadmap aligned to system maturity",
        ],
      },
      {
        type: "image",
        alt: "Design deliverables for the C1 Decision Engine: component library, interaction patterns, and migration roadmap",
        src: "/projects/images/c1-decision-engine-deliverables.png",
      },
      { type: "hr" },
      { type: "h2", text: "Component Deep Dive: Rule Cell (Conceptual)" },
      {
        type: "p",
        text: "One critical interaction pattern encapsulated complex decision logic into a single, reusable unit.",
      },
      {
        type: "image",
        alt: "Component system sheet for the rule cell: data-attribute badges (Income, Expense, Asset, Liability), Approve and Deny outcome badges, comparison-operator chips, and the rule row's default, hover, and selected states",
        caption:
          "The rule cell's vocabulary: attribute badges, outcome badges, operators, and row states.",
        src: "/projects/images/04_component_system_dark.png",
        frame: "Decision engine · Component system",
      },
      {
        type: "image",
        alt: "Create-a-new-decision-model flow: step 1 assigns the ruleset's outcome from six options (Decline, Assign Credit Limit, Require Action, Award Rewards, Accumulate Rewards, Assign Minimum Credit Limit); step 2 names the model",
        caption:
          "Upstream of the cell: each ruleset is scoped to a single outcome before any rule is authored.",
        src: "/projects/images/c1-decision-engine-data-element-selector.png",
        frame: "Decision engine · New model flow",
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
        text: "Each row maps a data attribute to an operator, a value, and an outcome. Inline editing — badge tap, dropdown, direct input — replaced the modal-heavy workflow, cutting the path to a saved rule from eight clicks to three.",
      },
      { type: "h3", text: "Impact" },
      {
        type: "p",
        text: "In discovery testing, analysts completed 12 of 13 tasks, with markedly lower rule-creation error rates than the spreadsheet baseline.",
      },
      { type: "hr" },
      { type: "h2", text: "Inside the Prototype" },
      {
        type: "p",
        text: "The prototype above is an open-source extraction of the rule-row pattern — React, TypeScript, Vite — with the proprietary domain logic stripped and the interaction model intact. A few interactions worth calling out:",
      },
      { type: "h3", text: "Onboarding: three decisions, one page" },
      {
        type: "p",
        text: "Instead of an empty editor, a guided three-step setup: pick an outcome, name the model, choose the data it may evaluate — each step one decision, all on one scrollable page.",
      },
      {
        type: "image-pair",
        images: [
          {
            alt: "Step 1 of the onboarding flow: Assign an outcome for ruleset, with six options (Decline, Assign Credit Limit, Require Action, Award Rewards, Accumulate Rewards, Assign Minimum Credit Limit)",
            caption:
              "Step 1: outcome picker. Six mutually exclusive outcomes, each with a one-line description.",
            src: "/projects/images/decisioning-table-onboarding-step1.png",
          },
          {
            alt: "Step 3 of the onboarding flow: Create your first rule, showing a categorized data-element picker (FINANCIAL, EMPLOYMENT) with checkboxes and a type badge for each element",
            caption:
              "Step 3: categorized data elements. The right pane previews details for the selected element before you commit to it.",
            src: "/projects/images/decisioning-table-onboarding-step3.png",
          },
        ],
      },
      { type: "h3", text: "The rule table" },
      {
        type: "p",
        text: "Setup done, the model opens into the editor shown at the top of this page: one rule per line — name, attribute, operator, value, outcome.",
      },
      { type: "h3", text: "Segmented Approve / Deny outcome" },
      {
        type: "p",
        text: "Each row's outcome is a two-state segmented control — green Approve, red Deny, the unselected side a muted ghost. Faster than a dropdown, readable at a glance.",
      },
      {
        type: "outcome-demo",
        caption:
          "The real control, not a screenshot — flip any row's outcome and the pill springs across, settling into the semantic color. Selected state carries the color; the other side recedes to a muted ghost.",
      },
      { type: "h3", text: "Split-button progressive disclosure" },
      {
        type: "p",
        text: "The primary CTA is a split button: **+ Add rule** on the main face, a chevron for the secondary Add existing rule — the default stays one click away without burying the alternative.",
      },
      {
        type: "image",
        alt: "Split-button dropdown opened from the chevron next to + Add rule, showing two options: Add rule and Add existing rule",
        caption:
          "Split-button. One-click default, one-click-and-pick for the secondary action.",
        src: "/projects/images/decisioning-table-split-button.png",
        naturalSize: true,
        frame: "Decision engine · Split button",
      },
      { type: "hr" },
      { type: "h2", text: "Accessibility as a System Lever" },
      {
        type: "p",
        text: "Accessibility was built in at the system level, not retrofitted:",
      },
      {
        type: "ul",
        items: [
          "~30% improvement in accessibility compliance",
          "Clearer focus states and keyboard navigation",
          "More predictable interaction behavior across components",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Outcomes & Impact" },
      {
        type: "ul",
        items: [
          "Unified interaction patterns across a critical enterprise workflow",
          "Faster analyst task completion in usability testing",
          "Lower design and QA overhead through shared tokens and components",
          "A scalable foundation for future platform growth",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "In complex enterprise systems, clarity is a performance feature. Scalable UX isn't about simplifying problems — it's about **making complexity legible**.",
      },
    ],
  },
  "ot-design-system": {
    slug: "ot-design-system",
    title: "Building OTKit: From Drift to Discipline",
    scope: "iOS, Android, Web",
    timeline: "2022–2024",
    blocks: [
      {
        type: "image",
        alt: "OTKit Design System hero: overview of the design system River built at OpenTable spanning iOS, Android, and web",
        src: "/projects/images/otkit-ds-hero.png",
      },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "When I took ownership of OTKit — OpenTable's design system across iOS, Android, and web — it existed on paper but lacked cohesion, governance, and trust. The mandate: **turn a drifting system into an operational platform** teams actually relied on.",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Role", "Design Systems Lead"],
          ["Scope", "iOS, Android, Web"],
          ["Team", "6 product teams"],
          ["Timeline", "~1 year focused engagement"],
        ],
      },
      { type: "hr" },
      {
        type: "stats",
        items: [
          { value: "25%", label: "Less QA time" },
          { value: "≈$59K/yr", label: "Developer time reclaimed" },
          { value: "+2.19%", label: "Diner bookings, dynamic type" },
          { value: "6", label: "Teams on one system" },
        ],
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      { type: "p", text: "Design system drift was expensive and invisible. Surveys and 1:1 interviews revealed:" },
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
        text: "A 37-person survey across design, product, and engineering put numbers on it:",
      },
      { type: "h3", text: "One-off component creation" },
      {
        type: "p",
        text: "**100%** of iOS designers were creating one-off components often or occasionally, vs **60%** on web — unsurprising, given a mature web library (Buffet) and nothing comparable for native.",
      },
      {
        type: "quote",
        text: "I think iOS lacks the rich component system that web has (Buffet), and that poses some challenges for us. (Restaurant iOS engineer)",
      },
      { type: "h3", text: "Time spent clarifying styling during release" },
      {
        type: "p",
        text: "**75% of Restaurant web designers** spent **4–8 rounds** per release clarifying styling with engineering; **100% of Diner web designers** needed **0–3**.",
      },
      {
        type: "p",
        text: "Interviews surfaced the same insight from both sides: unclear documentation, scattered sources of truth, no shared component language — much of the style guide lived in designers' heads.",
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
        text: "Foundations made consistency possible without rewrites — adoption could happen across active codebases.",
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
        text: "This fixed actions that read as disabled, improved platform parity, and let teams adopt without rewriting UI.",
      },
      {
        type: "image",
        alt: "Figma Variables panel showing OTKit foreground color tokens: semantic roles (default, alt, disabled, action, success, info, warning, danger) mapped across Light and Dark themes with primitive references",
        caption: "Primitive → Semantic → Component. The three-tier contract that made OTKit's theming scale without forking.",
        src: "/projects/images/3UxjijGLRDUlHaXt.png",
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
        text: "Table Statuses validated the color system early: the feature needed color-coded reservation states, and the product team proposed 21+ new colors. We met the requirement with the existing accent palette — shipped on time, zero new colors, system coherent.",
      },
      {
        type: "demo",
        demo: "reservation-status",
        frameLabel: "OTKit · Reservations · Floor view",
        caption:
          "Live component, recreated from the OTKit Figma source. Advance a reservation through its service lifecycle to see each state's productive-motion feedback, or open the status dropdown to jump to any state. Every state is bound to an existing semantic OTKit token — no new color enters the system.",
      },
      {
        type: "note",
        text: "Fidelity note: fills, type, and states are pulled from the real `reservation-states` component. Two source states (No show, Dessert) whose white label sat just under WCAG AA were nudged a half-step darker here to pass — the remediation an accessibility audit would recommend.",
      },
      { type: "h3", text: "The same system, denser: table-status tiles" },
      {
        type: "p",
        text: "The **floor plan** is the denser half of the same screen — table tiles color-coded by the same palette. Labels sit *on* the color, so each tile pairs its fill with its own `foreground/on-*` token to stay legible.",
      },
      {
        type: "demo",
        demo: "table-status",
        frameLabel: "OTKit · Floor plan · Table status",
        caption:
          "Live recreation of the real table-status tiles — the floor-plan counterpart to the reservation button. Each tile's label uses its background's foreground/on-* token, so all 21 clear WCAG AA. Select a tile to inspect its background token, label token, and live contrast ratio.",
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
        type: "video",
        alt: "Dynamic text sizing from small to large on an iOS iPhone, driven by the user's accessibility settings",
        caption: "Animation of dynamic text sizing implemented on iOS",
        src: "/projects/images/casestudy-otkit-dynamic-text.mp4",
        poster: "/projects/images/casestudy-otkit-dynamic-text-poster.jpg",
      },
      {
        type: "image",
        alt: "Contextual typography scale showing size, weight, and family defined per platform context",
        caption:
          "The contextual type scale reduced 39 font variants to a purposeful, platform-aware system.",
        src: "/projects/images/casestudy-otkit-typescale.png",
      },
      {
        type: "image",
        alt: "System maturity over time: typography evolution from raw sizes to semantic naming to brand-refresh naming",
        src: "/projects/images/casestudy-otkit-system-maturity.png",
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
        text: "The result: a **searchable, themeable SVG system** shared across native and web teams — duplication dropped, accessibility parity improved.",
      },
      {
        type: "image",
        alt: "Screenshot of searchable icon library on documentation site",
        src: "/projects/images/casestudy-otkit-icon-library.png",
        frame: "OTKit docs · Icon library",
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
        text: "OpenTable competes in an industry drenched in red and orange. Partnering with Brand, we translated a premium direction into **tokenized theming** rather than one-off visual treatments.",
      },
      {
        type: "video",
        alt: "Updated OTKit brand and theme animating through the OpenTable iPhone app",
        src: "/projects/images/casestudy-otkit-opentable-new-brand-app.mp4",
        poster: "/projects/images/casestudy-otkit-opentable-new-brand-app-poster.jpg",
        naturalSize: true,
      },
      {
        type: "video",
        alt: "Updated OTKit iconography animation, as shared by Debby on LinkedIn",
        src: "/projects/images/casestudy-otkit-opentable-icons-debby-linkedin.mp4",
        poster: "/projects/images/casestudy-otkit-opentable-icons-debby-linkedin-poster.jpg",
        naturalSize: true,
      },
      { type: "p", text: "The refresh carried:" },
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
        text: "Because brand decisions were encoded as token values, the system absorbed a major brand shift without teams rewriting components.",
      },
      { type: "hr" },
      { type: "h2", text: "Theming in Practice" },
      { type: "h3", text: "Mass Theme" },
      {
        type: "p",
        text: "Mass serves the core audience: editorial in feel, two-column, booking surfaced immediately, minimal visual noise.",
      },
      {
        type: "image",
        alt: "Mass Theme: functional editorial restaurant detail with hero section, two-column layout, and booking flow",
        src: "/projects/images/ot-brand-refresh-mass-theme.png",
        frame: "OpenTable.com · Mass theme",
      },
      { type: "h3", text: "Iconic Theme" },
      {
        type: "p",
        text: "Iconic, the premium tier: full-bleed photography, dark wine-toned time slots, sticky booking. Same tokens, same components — no fork, just different values.",
      },
      {
        type: "image",
        alt: "Iconic Theme: premium experience with full-bleed imagery, icon badges, and dark-wine timeslots",
        src: "/projects/images/ot-brand-refresh-iconic-theme.png",
        frame: "OpenTable.com · Iconic theme",
      },
      {
        type: "p",
        text: "**See it live:** browse the [Icons collection of premium restaurants](https://www.opentable.com/icons/san-francisco), or open an individual [Iconic restaurant page (Rich Table, San Francisco)](https://www.opentable.com/r/rich-table-san-francisco) to see the theme in production.",
      },
      { type: "hr" },
      { type: "h2", text: "Outcomes & Impact" },
      { type: "p", text: "OTKit delivered measurable ROI:" },
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
        type: "p",
        text: "Follow-up surveys also showed a **27% lift in clarity around Figma component sources**.",
      },
      { type: "hr" },
      { type: "h2", text: "What Made This Work" },
      {
        type: "p",
        text: "Adoption came through advocacy, not enforcement: **design ambassadors** embedded in product teams championed the system locally and surfaced friction back to the core team.",
      },
      {
        type: "image",
        alt: "Photo from OTKit design ambassadorship program",
        caption: "Design ambassadors in product teams acted as system advocates and real-world feedback channels.",
        src: "/projects/images/casestudy-otkit-ambassadorship.png",
      },
      {
        type: "p",
        text: "Documentation was a **first-class deliverable**, kept in sync with engineering — backed by office hours, live demos, and a system newsletter.",
      },
      {
        type: "image",
        alt: "Screenshot of the OTKit system newsletter",
        caption: "The OTKit newsletter kept teams aligned on system changes, deprecations, and new patterns.",
        src: "/projects/images/casestudy-otkit-newsletter.png",
      },
      {
        type: "quote",
        text: "I wanted to mention how helpful it has been having River support me on the design systems front. His depth of knowledge has been invaluable for our team. (Jordon, Restaurant Design Ambassador)",
      },
      {
        type: "p",
        text: "Trust came from follow-through: issues answered fast, breaking changes migrated for teams. That turned skeptics into advocates.",
      },
      { type: "hr" },
      { type: "h2", text: "Learnings" },
      { type: "h3", text: "Challenge: Lack of native Figma support for design tokens" },
      {
        type: "p",
        text: "We started before Figma shipped Variables, managing tokens through naming conventions and manual syncing. We migrated fast when Variables arrived, but the gap cost early momentum — next time, clearer expectations about interim tooling from the start.",
      },
      { type: "h3", text: "Challenge: Communicating with remote teams" },
      {
        type: "p",
        text: "With teams across North America, Europe, and Asia, updates got lost and context didn't travel. The newsletter became our most effective channel — I'd start it, and the async-first habits, much earlier.",
      },
      { type: "h3", text: "Challenge: Scaling myself" },
      {
        type: "p",
        text: "System work kept getting pulled into feature support, and without clear boundaries it was easy to become a bottleneck. The ambassador model helped; drawing that line earlier would have protected more foundational time.",
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "The success of OTKit wasn't the components. It was the shift in mindset. The system became something teams relied on, not something they worked around.",
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
        text: "OpenTable's reservation details view was the most legacy-styled screen in the product — dense, fragmented, expensive to maintain, and used by operators every shift. I led the redesign: modernize the experience, **keep the density operators depend on**.",
      },
      {
        type: "image",
        alt: "Reservation Details, before-and-after comparison. Legacy flat layout on the left; the redesigned card-based hierarchy on the right.",
        caption: "iPad → iPhone. Reverse-engineering OpenTable's Front of House iPad app to iPhone and Android.",
        src: "/projects/images/ot-reservations-native-ios-android.png",
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
      {
        type: "stats",
        items: [
          { value: "0", label: "Data loss or regressions" },
          { value: "10 wks", label: "Kickoff to shipped" },
          { value: "Web + native", label: "Shared component coverage" },
        ],
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Years of accumulated features had made the view:",
      },
      {
        type: "ul",
        items: [
          "Dense and visually fragmented",
          "Difficult to scan under time pressure",
          "Inconsistent across platforms",
          "Costly to maintain across distributed engineering teams",
        ],
      },
      {
        type: "image",
        alt: "Before and after comparison of the reservation card: legacy flat layout on the left, redesigned modular card-based hierarchy on the right",
        caption: "Before → After. Same information density, restructured for clarity and cross-platform consistency.",
        src: "/projects/images/ot-reservations-reservation-card-before-after.png",
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
      {
        type: "ul",
        items: [
          "Preserve density, improve hierarchy",
          "Replace bespoke layouts with reusable system components",
          "Design once, scale across platforms",
        ],
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
      { type: "h3", text: "Modular ecosystem" },
      {
        type: "image",
        alt: "Annotated diagram showing how guest and reservation information was made modular across Back of House, Front of House, Web, iOS, and Android",
        caption: "Making guest and reservation information modular: components designed to scale across multiple contexts.",
        src: "/projects/images/ot-reservations-modularity.png",
      },
      {
        type: "image-pair",
        images: [
          {
            alt: "Screenshot of the redesigned Guest Profile component in the Back of House web view",
            caption: "The Guest Profile component in the Back of House web view.",
            src: "/projects/images/ot-reservations-guest-profile-boh.png",
          },
          {
            alt: "Close-up screenshot of the Guest Profile component showing structured guest data in Back of House",
            caption: "Close-up: structured guest data, easily scannable in Back of House.",
            src: "/projects/images/ot-reservations-guest-profile-boh-detail.png",
          },
        ],
      },
      {
        type: "image",
        alt: "Animation showing the modular card-based breakdown of the reservation details view",
        caption:
          "Each section of the reservation view mapped to a discrete system pattern, making the layout predictable for both users and engineers.",
        src: "/projects/images/zwVjhA3cW2v1jFcL.gif",
        naturalSize: true,
      },
      {
        type: "image",
        alt: "Animation of the updated iOS Restaurant app showing modular layout and design system components",
        caption:
          "The modular card architecture in action: each zone behaves predictably and scales responsively across screen sizes.",
        src: "/projects/images/ot-reservations-ios-modular-layout.gif",
        naturalSize: true,
      },
      { type: "hr" },
      { type: "h2", text: "System Alignment" },
      { type: "p", text: "This work became OTKit's proving ground in real product conditions:" },
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
        caption: "OTKit tokens in SwiftUI",
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
        text: "Designing for restaurant operators reinforced that usability isn't about simplification. It's about **clarity under pressure**.",
      },
    ],
  },
  "system": {
    slug: "system",
    title: "Building Parsimony, an Agentic Design System",
    scope: "Token architecture, component library, agent tooling",
    timeline: "2026 (ongoing)",
    blocks: [
      {
        type: "diagram",
        alt: "Architecture diagram of the Parsimony agentic design system: tokens flow through Style Dictionary build, into Lit web components and a merged metadata artifact, then out to humans (Figma, docs) and agents (MCP server), consumed by every site, with a drift-detection feedback loop back to the source",
        caption:
          "The whole system in one view: one source of truth, read by both people and agents. Green is shipped; dashed amber is planned.",
        src: "/projects/images/ds-architecture.svg",
      },
      {
        type: "quote",
        text: "Most design systems are documentation a person has to read. Parsimony is data an agent can query, build against, and lint itself with before it ships any UI.",
      },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "Interfaces are increasingly assembled by agents, and design systems were never written for that reader. Most of my own work now happens through AI agents, so I built a system whose rules a machine can read, build against, and self-check.",
      },
      {
        type: "p",
        text: "**Parsimony is a design system with an API for agents.** One source of truth runs from DTCG tokens, through framework-agnostic Web Components, to an MCP server an agent can query and lint against before it writes any UI.",
      },
      {
        type: "note",
        text: "Note: A personal project, live across my own sites plus an enterprise UI sub-brand. Shipped vs deferred is marked throughout; the [public roadmap](https://github.com/digital2analogue/parsimony/milestones) tracks what's next.",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Role", "Designer & Design Engineer"],
          ["Scope", "Token architecture, components, agent tooling"],
          ["Stack", "DTCG · Style Dictionary · Lit · MCP · Figma Code Connect"],
          ["Status", "Live and evolving"],
        ],
      },
      {
        type: "p",
        text: "**Browse the [live token catalog](/tokens)** — this site consumes the system it documents.",
      },
      { type: "hr" },
      {
        type: "stats",
        items: [
          { value: "21", label: "Framework-agnostic components" },
          { value: "4", label: "Brands from one source" },
          { value: "2", label: "Token tiers — primitives → semantic" },
        ],
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Design systems are written for people — docs sites, Figma libraries, \"use this, not that.\" But the thing building my UI now is an agent, and an agent doesn't read your docs site. Without the system as data, every agent reinvents, and drift spreads to every repo that consumes it.",
      },
      {
        type: "p",
        text: "The problem was never missing tokens. It was that nothing in the system was **readable by a machine**.",
      },
      { type: "hr" },
      { type: "h2", text: "The Architecture" },
      {
        type: "p",
        text: "One repo, one direction of flow — the diagram above is the entire system. The decision that holds it together: **tokens and components version together**, so a token rename is a breaking change by design and there's no version skew across packages.",
      },
      {
        type: "ul",
        items: [
          "**Author.** DTCG tokens in two layers: primitives (raw values) → semantic (named roles UI writes against). Brand overrides re-point the same semantic roles.",
          "**Build.** Style Dictionary compiles every brand to CSS. A validation gate rejects hardcoded hex, primitive references, and dangling token aliases, so a rename that wasn't propagated fails the build, not production.",
          "**Components.** 21 framework-agnostic Lit web components, wired to Figma via Code Connect.",
          "**Artifact.** Each component's hand-authored metadata merges with its auto-generated Custom Elements Manifest into a single design-system.json.",
          "**Interfaces.** Humans read Figma and Markdown docs; agents read an MCP server.",
          "**Consumers.** Every site and product repo pulls from one source, now as an installable token package.",
        ],
      },
      {
        type: "diagram",
        alt: "Token resolution diagram: a semantic token (background.success-alt) resolves to a primitive (color.green.chip = #0F2016), rendering as a success badge. A footer rule states UI references semantic roles, never primitives, and brand overrides re-point the semantic role without touching components.",
        caption:
          "Two tiers, one value — UI writes against named semantic roles, and each role resolves to exactly one raw primitive. Brand overrides re-point the semantic role; the components never change.",
        src: "/projects/images/ds-token-tiers.svg",
      },
      { type: "hr" },
      { type: "h2", text: "One Source of Truth, Four Brands" },
      {
        type: "diagram",
        alt: "Four brand panels: base (dark, phosphor green accent), decision-engine (light inversion, blue accent), dot-art (pure-black canvas), and dot-blog (18px reading). Each shows the same UI rendered in its own canvas, surface, text, and accent token values.",
        caption:
          "Every brand is the same token graph with a thin override layer. No forks; the difference is data.",
        src: "/projects/images/ds-brands.svg",
      },
      {
        type: "p",
        text: "Decision-engine flips it to a light enterprise theme with a blue primary. dot-art swaps the canvas to pure black for photos. dot-blog bumps up the reading size. None of this forks a component. Each brand is just a small override file on top of the same tokens.",
      },
      { type: "hr" },
      { type: "h2", text: "Components as Contracts" },
      {
        type: "diagram",
        alt: "A rendered badge.meta.json file with callouts highlighting tokensUsed (which tokens the component may touch), rules (the constraints it must obey), and accessibility (the ARIA pattern and WCAG criteria it implements)",
        caption:
          "badge.meta.json: the component's machine-readable rulebook. get_component() returns it verbatim.",
        src: "/projects/images/ds-meta-json.svg",
      },
      {
        type: "p",
        text: "Each component ships its own rulebook: the tokens it may touch, the rules that bind it, the ARIA pattern and WCAG criteria it implements. That file is the spec — and the same file the agent reads, with prop descriptions single-sourced from the code's JSDoc so the contract can't drift from the implementation.",
      },
      { type: "hr" },
      { type: "h2", text: "Docs That Can't Drift" },
      {
        type: "diagram",
        alt: "The documentation pipeline: metadata (design-system.json, meta.json, token store) feeds a deterministic DocGen pass that emits one MDX file per component. Each file splits into GEN regions (properties, tokens, accessibility) that regenerate every run and AUTHORED regions (overview, usage) that are preserved. Output is released to a shipped CI freshness gate and a planned human docs site.",
        caption:
          "Component docs are generated from the same metadata the agent reads. GEN regions regenerate; AUTHORED prose is preserved; a CI gate blocks a stale doc from merging.",
        src: "/projects/images/ds-docs-pipeline.svg",
      },
      {
        type: "p",
        text: "Docs are generated from the same metadata the agent reads: the mechanical sections regenerate on every run, hand-written prose is preserved, and a CI gate fails the build if a component change leaves its docs stale.",
      },
      { type: "hr" },
      { type: "h2", text: "check_usage: Governance, Moved Upstream" },
      {
        type: "diagram",
        alt: "The check_usage MCP tool: an input panel of agent-proposed CSS containing a hardcoded hex and a primitive-token reference (both flagged red), feeding into an output panel listing the two rule violations returned by the system",
        caption:
          "Paste a snippet, get back every violation. Catch the mistake before it ships, not after.",
        src: "/projects/images/ds-check-usage.svg",
      },
      {
        type: "p",
        text: "Design-system checks usually happen after the fact — a linter in CI, a reviewer in a PR. **check_usage moves that earlier**: hand the system a snippet before the code exists, get back every violation.",
      },
      {
        type: "demo",
        demo: "check-usage",
        surface: "dark",
        frameLabel: "Parsimony · check_usage · Playground",
        caption:
          "Live: edit the snippet and watch the violations update. A faithful port of the static rules — hardcoded hex, primitive references, hardcoded type. The deployed MCP tool runs the same rule set plus deprecated-token checks against the live registry.",
      },
      {
        type: "p",
        text: "The same rules run in three places: this check, the build gate, and the drift scan. So the answer an agent gets here is the one the build will enforce later.",
      },
      { type: "hr" },
      { type: "h2", text: "An Agent, Self-Correcting" },
      {
        type: "diagram",
        alt: "A terminal-style agent session. The agent calls get_component(\"rr-badge\") and gets back the contract (props, 31 semantic tokens, rules, a11y). It drafts a badge with hardcoded hex values, calls check_usage, and gets two no-hex violations quoting the verbatim rule message. It then revises to <rr-badge variant=\"success\">Active</rr-badge> and re-runs check_usage, which returns no violations.",
        caption:
          "One session, four steps: get_component, a hand-rolled draft, check_usage, a fix. The violation text is the literal output of the shared rule set, not a mockup.",
        src: "/projects/images/ds-agent-loop.svg",
      },
      {
        type: "p",
        text: "The whole argument in one session: the agent asks what a badge is, drafts it the quick way with raw hex, runs check_usage, gets back the exact violations the build would reject, and ships the component instead. None of it is staged.",
      },
      { type: "hr" },
      { type: "h2", text: "Decisions & Tradeoffs" },
      {
        type: "p",
        text: "Three decisions, and what each one cost.",
      },
      { type: "h3", text: "Distribution: public npm over GitHub Packages" },
      {
        type: "p",
        text: "GitHub Packages requires a login even for public installs — every build would need a token just to download tokens. Public npm installs with none, and tokens are just CSS that ships to the browser anyway.",
      },
      { type: "h3", text: "The agent interface: MCP over docs or a REST API" },
      {
        type: "p",
        text: "Docs don't work (agents don't read them); a REST API needs a server, a login, and discovery. MCP is what agents already speak — the session writing the code can just ask. The cost: it's new, and mine runs locally, which is fine while I'm the main user.",
      },
      { type: "h3", text: "Components: Web Components over React" },
      {
        type: "p",
        text: "Lit Web Components are clunkier inside React — the real cost. But one version works everywhere (React, plain HTML, Figma mapping) instead of three synchronized buttons. One source beats the smoother React-only version.",
      },
      { type: "hr" },
      { type: "h2", text: "Honest Status" },
      {
        type: "p",
        text: "Part of the work was deciding what to leave unbuilt. Where things stand:",
      },
      { type: "h3", text: "Shipped" },
      {
        type: "ul",
        items: [
          "Two-layer token architecture (primitives → semantic) across four brands",
          "21 Lit web components, wired to Figma via Code Connect",
          "MCP server with 17 tools: contracts, tokens, rules, decisions, brand diffs, contrast checks, consumer linting",
          "One shared rule set behind every checker — the build gate, check_usage, and the drift scan can't disagree",
          "CI on every change: schema checks, lint rules, token-reference resolution, stale-artifact check, full test suite",
          "Tokens ship as a versioned npm package — this site already consumes it",
          "A scheduled drift scan opens a tracked issue on drift, closes it when the consumer comes back clean",
          "WCAG AA contrast verified across every token pairing",
        ],
      },
      { type: "h3", text: "Deliberately deferred" },
      {
        type: "ul",
        items: [
          "Publishing the component library and MCP server to npm (the token package ships today)",
          "Migrating the remaining sites (.art, .blog) onto the package",
          "Auto-fixing drift: the scan detects and files issues today; opening a fix PR is next",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "Every system I'd built before made things clear to people. This one asks what a system looks like when its main reader is a machine — and the answer wasn't more documentation, it was **structure**: tokens as data, components that carry their own rules, a system an agent can query.",
      },
      {
        type: "p",
        text: "A component library tells you what exists. This one also tells an agent what it's allowed to use.",
      },
    ],
  },
};
