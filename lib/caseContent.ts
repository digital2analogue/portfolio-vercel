import type { DemoKey } from "@/components/demos/registry";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; alt: string; caption?: string; src?: string; naturalSize?: boolean; frame?: string; dither?: boolean }
  | { type: "video"; src: string; alt: string; caption?: string; poster?: string; naturalSize?: boolean }
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
        text: "Policy analysts at Capital One were building complex decision logic in spreadsheets — copy-pasting rules between tabs, manually cross-referencing compliance constraints, hoping nothing broke downstream. I led design systems strategy to replace that fragile workflow with a modular, system-aligned interface for high-stakes, compliance-sensitive environments.",
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
        text: "Before the write-up — the actual thing. A public-safe, runnable prototype of the decision engine: drag a rule to reorder, flip an outcome, edit any cell. Open the [full onboarding flow](https://decisioning-table.vercel.app) or [skip straight to the table](https://decisioning-table.vercel.app?demo=1).",
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
        text: "Analysts relied on a patchwork of spreadsheets and inconsistent UI patterns to define and manage complex decision logic. The cost was real:",
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
        text: "The core issue wasn't missing features. It was **structural ambiguity**.",
      },
      {
        type: "image",
        alt: "Before: spreadsheet workflow used prior to the decision engine",
        src: "/projects/images/c1-decision-engine-before.png",
        naturalSize: true,
        dither: true,
      },
      { type: "hr" },
      { type: "h2", text: "Constraints" },
      {
        type: "ul",
        items: [
          "Compliance-sensitive domain with low tolerance for error",
          "Legacy interaction patterns deeply embedded in daily workflows",
          "Code base was using open-source Ant Design System instead of Capital One's Gravity Design System",
          "Need for incremental migration rather than a full rebuild",
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
          "Define a progression from tokens → core components → reusable patterns",
          "Encapsulate complexity rather than exposing it",
          "Treat adoption and governance as design problems, not enforcement problems",
        ],
      },
      {
        type: "p",
        text: "Teams could reason about complex logic consistently — without sacrificing flexibility.",
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
          "Centralized a shared component library (Figma and Storybook) as the single source of truth",
          "Defined repeatable interaction patterns for common analyst tasks",
          "Created a migration roadmap aligned to system maturity",
        ],
      },
      {
        type: "p",
        text: "The onboarding flow walked analysts through a three-step setup on a single page: choosing an outcome type, naming the model, and selecting the data elements it could evaluate. Each step was scoped to a single decision, reducing cognitive load before reaching the main interface.",
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
          "The rule cell's vocabulary: attribute badges, outcome badges, operators, and row states — every rule composes from these parts.",
        src: "/projects/images/04_component_system_dark.png",
        frame: "Decision engine · Component system",
      },
      {
        type: "image",
        alt: "Create-a-new-decision-model flow: step 1 assigns the ruleset's outcome from six options (Decline, Assign Credit Limit, Require Action, Award Rewards, Accumulate Rewards, Assign Minimum Credit Limit); step 2 names the model",
        caption:
          "Upstream of the cell: each ruleset is scoped to a single outcome before any rule is authored, so a rule cell never has to express conflicting outcomes.",
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
        text: "Each rule row maps a data attribute to an operator, a threshold value, and a decision outcome. The inline edit model (badge tap to swap attribute, dropdown for operator, direct input for value) eliminated the modal-heavy workflows analysts had been tolerating, cutting the path to a saved rule from eight clicks down to three (a 63% reduction).",
      },
      { type: "h3", text: "Impact" },
      {
        type: "p",
        text: "In discovery testing, analysts completed 12 of 13 tasks against the new model, with markedly lower error rates during rule creation than the spreadsheet baseline.",
      },
      { type: "hr" },
      { type: "h2", text: "Inside the Prototype" },
      {
        type: "p",
        text: "The prototype above is an open-source extraction of the rule-row pattern, rebuilt in React, TypeScript, and Vite. It strips out the proprietary domain logic, keeps the interaction model intact, and ships the result as a reference implementation for the same class of decisioning interface. A few interactions worth calling out:",
      },
      { type: "h3", text: "Onboarding: three decisions, one page" },
      {
        type: "p",
        text: "Rather than dropping users into an empty editor, the prototype opens with a guided three-step setup: pick an outcome type, name the model, then choose the data the model is allowed to evaluate. Each step is scoped to a single decision, and the whole flow lives on a single scrollable page so the model's shape stays visible while you build it.",
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
        text: "Once setup is done, the model opens into the main editor shown at the top of this page: a five-row example ruleset with each rule on a single line — name, data attribute, operator, value, optional companion attributes, and the outcome.",
      },
      { type: "h3", text: "Segmented Approve / Deny outcome" },
      {
        type: "p",
        text: "Each row's outcome is a segmented two-state control: green Approve on the left, red Deny on the right, with the unselected side rendered as a muted ghost. It's faster than a dropdown for binary outcomes and reads at a glance when scanning a ruleset.",
      },
      {
        type: "outcome-demo",
        caption:
          "The real control, not a screenshot — flip any row's outcome and the pill springs across, settling into the semantic color. Selected state carries the color; the other side recedes to a muted ghost.",
      },
      { type: "h3", text: "Split-button progressive disclosure" },
      {
        type: "p",
        text: "The primary CTA is a split button: the main face is **+ Add rule** (the common path), and a chevron beside it opens a small menu with the secondary action, Add existing rule. The split keeps the default action one click away while making the alternative discoverable rather than buried in a kebab menu.",
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
        text: "Accessibility improvements were embedded at the system level rather than treated as retrofits.",
      },
      { type: "p", text: "The results:" },
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
        text: "In complex enterprise systems, clarity is a performance feature. This work reinforced that scalable UX isn't about simplifying problems. It's about **making complexity legible**.",
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
        dither: true,
      },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "When I took ownership of OTKit — OpenTable's design system spanning iOS, Android, and web — the system existed on paper. In practice, it lacked cohesion, governance, and trust. Design drift, fragmented sources of truth, and inconsistent adoption were slowing teams down and introducing costly QA issues.",
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
        text: "A survey of 37 respondents across design, product, and engineering revealed the depth of the problem:",
      },
      { type: "h3", text: "One-off component creation" },
      {
        type: "p",
        text: "**100%** of iOS designers said they were creating new or one-off components often or occasionally, compared to **60%** of web designers across both Restaurant and Diner teams. iOS teams suffered the most, which made sense given we had a much more mature web component library (Buffet) but nothing comparable for native.",
      },
      {
        type: "quote",
        text: "I think iOS lacks the rich component system that web has (Buffet), and that poses some challenges for us. (Restaurant iOS engineer)",
      },
      { type: "h3", text: "Time spent clarifying styling during release" },
      {
        type: "p",
        text: "**75% of Restaurant web designers** reported spending **4–8 rounds** clarifying styling with engineering during each release cycle. Meanwhile, **100% of Diner web designers** reported only **0–3 rounds**. Cross-functional Restaurant teams were spending significantly more time reconciling their style guide with designers and developers.",
      },
      { type: "h3", text: "Consolidating research" },
      {
        type: "p",
        text: "We ran 1:1 interviews and remote collaborative brainstorms using FigJam and Dovetail. The main insight was clear: designers and engineers often had the **same problem**, namely unclear documentation, scattered sources of truth, and no shared language for components. Most folks knew what colors and styles to use, but much of the style guide lived in designers' heads rather than in a system.",
      },
      {
        type: "quote",
        text: "We have a ton of legacy styles and pages on our iOS apps and it's always a push and pull on when and how to update those. (Cris, designer on Restaurant product)",
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
        text: "These foundational changes made consistency possible without forcing large rewrites — adoption could happen across active codebases, not instead of them.",
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
        text: "A real product use case validated the color system early. The Table Statuses feature needed color-coded indicators for reservation states — and the product team initially proposed 21+ new colors. By collaborating with the design system team, we satisfied the project requirements using the existing accent palette, reducing color sprawl while shipping on time. The product got what it needed. The system stayed coherent.",
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
        text: "The reservation button is one half of the floor screen. The other half is the **floor plan** — a grid of table tiles, each a table number plus a course icon, color-coded by the same semantic palette. Here the label and icon sit *on* the color, so each tile pairs its fill with its own `foreground/on-*` token to stay legible.",
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
        text: "OpenTable operates in an industry dominated by red and orange. Partnering closely with Brand, we translated a premium direction into a **tokenized theming architecture** rather than one-off visual treatments.",
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
        text: "The Mass theme serves OpenTable's core restaurant audience. Editorial in feel, it uses a two-column structure inspired by e-commerce: booking surfaced immediately, decisions guided with minimal visual noise. Every component follows the same token-driven pattern, so new features land consistently without bespoke design decisions at the component level.",
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
        text: "For OpenTable's premium Iconic restaurant tier, the system delivered a distinct but coherent experience. Full-bleed photography, dark wine-inspired time slot styling, and sticky booking flows communicated prestige without sacrificing usability. The same underlying tokens and components powered both themes. No fork required, just a different set of token values.",
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
        text: "Designers and engineers also reported a **27% lift in clarity around Figma component sources** in our follow-up survey. The consolidation work made it easier to find authoritative components without hunting through legacy Storybooks and one-off libraries.",
      },
      {
        type: "quote",
        text: "OTKit scaled across 6 product teams, supporting iOS, Android, and web simultaneously.",
      },
      { type: "hr" },
      { type: "h2", text: "What Made This Work" },
      {
        type: "p",
        text: "OTKit's adoption didn't happen through enforcement. We built a network of **design ambassadors**: designers embedded in product teams who championed the system locally and surfaced friction back to the core team. This created a feedback loop that made the system more useful over time.",
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
        text: "I wanted to directly reach out and thank you for your feedback in today's session. All of the links and resources you shared were incredibly helpful. (Stephanie, Restaurant Design Ambassador)",
      },
      {
        type: "quote",
        text: "I wanted to mention how helpful it has been having River support me on the design systems front. His depth of knowledge has been invaluable for our team. (Jordon, Restaurant Design Ambassador)",
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
        text: "We started work on the foundations before Figma released Variables. This meant we initially had to manage tokens through workarounds: naming conventions, separate documentation, and manual syncing. When Variables shipped, we migrated quickly, but the gap cost us early momentum.",
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
        text: "**What I'd do next time:** Lean harder into async from the start, with more recorded video demos, tech talks, dedicated Slack Q&A channels, and newsletters. The newsletter ended up being one of our most effective tools, and I wish we'd started it earlier.",
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
        text: "OpenTable's reservation details view had become the most legacy-styled screen in the product — dense, visually fragmented, and expensive to maintain. Restaurant operators used it every shift, but years of accumulated features had buried the information hierarchy. I led the redesign to modernize the experience while preserving the density operators depended on.",
      },
      {
        type: "p",
        text: "Design systems driving **practical product outcomes** — not just visual consistency.",
      },
      {
        type: "image",
        alt: "Reservation Details, before-and-after comparison. Legacy flat layout on the left; the redesigned card-based hierarchy on the right.",
        caption: "iPad → iPhone. Reverse-engineering OpenTable's Front of House iPad app to iPhone and Android.",
        src: "/projects/images/ot-reservations-native-ios-android.png",
        dither: true,
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
        text: "Despite its importance, it had the **most legacy styling** in the product, making UX improvements slow and risky.",
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
        text: "Modernize the experience without disrupting established workflows.",
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
      {
        type: "p",
        text: "This work showed how design systems can enable meaningful product improvements without disrupting workflows that teams depend on daily.",
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
        type: "image",
        alt: "Architecture diagram of the Parsimony agentic design system: tokens flow through Style Dictionary build, into Lit web components and a merged metadata artifact, then out to humans (Figma, docs) and agents (MCP server), consumed by every site, with a drift-detection feedback loop back to the source",
        caption:
          "The whole system in one view: one source of truth, read by both people and agents. Green is shipped; dashed amber is planned.",
        src: "/projects/images/ds-architecture.png",
        naturalSize: true,
      },
      {
        type: "quote",
        text: "Most design systems are documentation a person has to read. Parsimony is data an agent can query, build against, and lint itself with before it ships any UI.",
      },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "Interfaces are increasingly assembled by agents rather than typed by hand, and design systems were never written for that reader. Most of my own work now happens through AI agents, in chat windows where I rarely see the whole codebase at once, so I built a design system for that setup. Instead of rules written for a person to read and remember, the rules are encoded so a machine can read them, build against them, and catch its own mistakes.",
      },
      {
        type: "p",
        text: "**Parsimony is a design system with an API for agents.** One source of truth runs from DTCG tokens, through framework-agnostic Web Components, to an MCP server an agent can query and lint against before it writes any UI.",
      },
      {
        type: "note",
        text: "Note: This is a personal project, not a team product. It runs across my own sites (.com, .design, .art, .blog) plus an enterprise UI sub-brand, and it's a work in progress — I've marked what's shipped versus what's deferred throughout, and the [public roadmap on GitHub](https://github.com/digital2analogue/parsimony/milestones) tracks what's in flight next.",
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
        text: "**Browse the live token catalog:** [the full token reference is here](/tokens). **Follow the roadmap:** [GitHub milestones](https://github.com/digital2analogue/parsimony/milestones) show what's shipping next.",
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
        text: "Design systems are written for people. Documentation sites, Figma libraries, \"use this, not that.\" All of it assumes a human who reads and remembers. But more and more, the thing building my UI is an agent, and an agent doesn't read your docs site.",
      },
      {
        type: "ul",
        items: [
          "Documentation assumes a human reader who remembers the rules",
          "The agent building your UI never visits your docs site",
          "Without the system as data, every agent reinvents, and drift spreads across every repo that consumes it",
        ],
      },
      {
        type: "p",
        text: "The problem was never missing tokens. It was that nothing in the system was **readable by a machine**.",
      },
      { type: "hr" },
      { type: "h2", text: "The Architecture" },
      {
        type: "p",
        text: "One repo, one direction of flow. The diagram above is the entire system. The decision that holds it together: **tokens and components version together.** A token rename is a breaking change to every component that uses it, by design, so there's no version skew to chase across separately published packages.",
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
        type: "image",
        alt: "Token resolution diagram: a semantic token (background.success-alt) resolves to a primitive (color.green.chip = #0F2016), rendering as a success badge. A footer rule states UI references semantic roles, never primitives, and brand overrides re-point the semantic role without touching components.",
        caption:
          "Two tiers, one value — UI writes against named semantic roles, and each role resolves to exactly one raw primitive. Brand overrides re-point the semantic role; the components never change.",
        src: "/projects/images/ds-token-tiers.png",
      },
      { type: "hr" },
      { type: "h2", text: "One Source of Truth, Four Brands" },
      {
        type: "image",
        alt: "Four brand panels: base (dark, phosphor green accent), decision-engine (light inversion, blue accent), dot-art (pure-black canvas), and dot-blog (18px reading). Each shows the same UI rendered in its own canvas, surface, text, and accent token values.",
        caption:
          "Every brand is the same token graph with a thin override layer. No forks; the difference is data.",
        src: "/projects/images/ds-brands.png",
      },
      {
        type: "p",
        text: "Decision-engine flips it to a light enterprise theme with a blue primary. dot-art swaps the canvas to pure black for photos. dot-blog bumps up the reading size. None of this forks a component. Each brand is just a small override file on top of the same tokens.",
      },
      { type: "hr" },
      { type: "h2", text: "Components as Contracts" },
      {
        type: "image",
        alt: "A rendered badge.meta.json file with callouts highlighting tokensUsed (which tokens the component may touch), rules (the constraints it must obey), and accessibility (the ARIA pattern and WCAG criteria it implements)",
        caption:
          "badge.meta.json: the component's machine-readable rulebook. get_component() returns it verbatim.",
        src: "/projects/images/ds-meta-json.png",
        naturalSize: true,
      },
      {
        type: "p",
        text: "Each component ships its own rulebook. badge.meta.json spells out which tokens the component may touch, which rules apply to it, and which ARIA pattern and WCAG criteria it implements. That file is the spec, and it's the same file the agent reads.",
      },
      {
        type: "p",
        text: "All 21 components carry an auto-generated Custom Elements Manifest, the basic API an agent needs to use one. Every one adds a hand-written meta.json on top, with the token, rule, and accessibility contract — and prop descriptions are single-sourced from the code's JSDoc, so the contract can't drift from the implementation.",
      },
      { type: "hr" },
      { type: "h2", text: "Docs That Can't Drift" },
      {
        type: "image",
        alt: "The documentation pipeline: metadata (design-system.json, meta.json, token store) feeds a deterministic DocGen pass that emits one MDX file per component. Each file splits into GEN regions (properties, tokens, accessibility) that regenerate every run and AUTHORED regions (overview, usage) that are preserved. Output is released to a shipped CI freshness gate and a planned human docs site.",
        caption:
          "Component docs are generated from the same metadata the agent reads. GEN regions regenerate; AUTHORED prose is preserved; a CI gate blocks a stale doc from merging.",
        src: "/projects/images/ds-docs-pipeline.png",
      },
      {
        type: "p",
        text: "The docs are generated from the same metadata, not hand-written. One deterministic pass turns each component's meta.json into an MDX page: the mechanical parts — props, tokens, accessibility — regenerate on every run, while the hand-written overview and usage prose stay preserved in place. A CI gate regenerates and diffs them, so a component change that didn't update its docs fails the build instead of quietly going stale.",
      },
      { type: "hr" },
      { type: "h2", text: "check_usage: Governance, Moved Upstream" },
      {
        type: "image",
        alt: "The check_usage MCP tool: an input panel of agent-proposed CSS containing a hardcoded hex and a primitive-token reference (both flagged red), feeding into an output panel listing the two rule violations returned by the system",
        caption:
          "Paste a snippet, get back every violation. Catch the mistake before it ships, not after.",
        src: "/projects/images/ds-check-usage.png",
      },
      {
        type: "p",
        text: "Most design-system checks happen after the fact: a linter in CI, or a reviewer catching drift in a pull request. **check_usage moves that earlier.** Before an agent settles on a pattern, it can hand the system a snippet and get back every violation: the hardcoded hex, the primitive reference, the deprecated token.",
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
      {
        type: "quote",
        text: "Before, drift surfaced in code review, after the code was already written. Now the agent checks the same rules before the line exists, turning a review-cycle catch into a single tool call.",
      },
      { type: "hr" },
      { type: "h2", text: "An Agent, Self-Correcting" },
      {
        type: "image",
        alt: "A terminal-style agent session. The agent calls get_component(\"rr-badge\") and gets back the contract (props, 31 semantic tokens, rules, a11y). It drafts a badge with hardcoded hex values, calls check_usage, and gets two no-hex violations quoting the verbatim rule message. It then revises to <rr-badge variant=\"success\">Active</rr-badge> and re-runs check_usage, which returns no violations.",
        caption:
          "One session, four steps: get_component, a hand-rolled draft, check_usage, a fix. The violation text is the literal output of the shared rule set, not a mockup.",
        src: "/projects/images/ds-agent-loop.png",
        naturalSize: true,
      },
      {
        type: "p",
        text: "Here is the whole argument in one session. The agent asks the system what a badge is, drafts the markup the quick way with raw hex, and runs check_usage before it commits to that. The system hands back the exact violations the build would later reject, so the agent drops the hand-rolled version and uses the component instead. Same tools, same rules, one loop. None of it is staged: the messages come straight from the shared rule set, and the fix is the component's own documented usage.",
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
        text: "I wanted people to install the tokens instead of copy-pasting a block of CSS. GitHub Packages seemed natural, since it sits right next to the repo. But it makes you log in to install a package, even a public one, so every site and every build would need a token just to download tokens. That's the friction I was trying to remove. With public npm, anyone installs with no login. And there was nothing to hide anyway. Tokens are just CSS that ships to the browser on every page.",
      },
      { type: "h3", text: "The agent interface: MCP over docs or a REST API" },
      {
        type: "p",
        text: "How should an agent read the system? Plain docs won't do, since agents don't open your docs site. A REST API would work, but it needs a server, a login, and the agent has to know it's there. MCP is the format agents already speak, so the same session writing the code can ask the system what it needs with no setup. Its one downside is that MCP is new, and mine runs on my machine rather than as a public service, which is fine while I'm the main user.",
      },
      { type: "h3", text: "Components: Web Components over React" },
      {
        type: "p",
        text: "I built the components as Web Components (using Lit) instead of React. They're a bit clunkier inside React, which is the real cost. But one version of each then works everywhere (React, plain HTML, or a Figma mapping), instead of building the same button three times and keeping them in sync. I'd rather maintain one source than the smoother React-only version.",
      },
      { type: "hr" },
      { type: "h2", text: "Honest Status" },
      {
        type: "p",
        text: "Part of the work was deciding what to leave unbuilt for now. Here's where things stand.",
      },
      { type: "h3", text: "Shipped" },
      {
        type: "ul",
        items: [
          "Two-layer token architecture (primitives → semantic) across four brands",
          "21 Lit web components, wired to Figma via Code Connect",
          "MCP server with 17 tools: component contracts, token lookup, design rules and the decision log, brand diffs, WCAG contrast checks, and consumer-repo linting",
          "One shared rule set behind every checker: the build gate, the MCP's check_usage, and the consumer drift scan all import the same rules, so they can't disagree",
          "A CI gate on every change: schema checks, lint rules, token-reference resolution, a stale-artifact check, and a full test suite",
          "Distribution: the token build ships as a versioned npm package, and this very site already consumes it as a dependency instead of hand-copying the CSS",
          "A scheduled drift scan that checks a consumer against the same rules and opens a tracked issue when it finds drift, closing it again when the consumer comes back clean",
          "WCAG AA contrast verified across every token pairing",
        ],
      },
      { type: "h3", text: "Deliberately deferred" },
      {
        type: "ul",
        items: [
          "Publishing the component library itself to npm (the token package ships today; the Lit components and the MCP server are next)",
          "Migrating the remaining sites onto the package (this portfolio, the decision-engine prototype, and the intro page consume it today; .art and .blog follow as they come online)",
          "Auto-fixing drift: the scheduled scan detects it and files an issue today; having it open a fix PR (a codemod) is the remaining step",
        ],
      },
      {
        type: "p",
        text: "The drift scan now runs on a schedule and opens a tracked issue when a consumer drifts; auto-opening a PR that fixes it is the part I've left for later. That order is deliberate, not a backlog.",
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "Every design system I'd built before was about making things clear to people. This one started from a different question: what does a system look like when its main reader is a machine?",
      },
      {
        type: "p",
        text: "The answer wasn't more documentation. It was **structure**: tokens stored as data, components that carry their own rules, and a system an agent can query.",
      },
      {
        type: "p",
        text: "There's no settled playbook for this yet. What an AI-native design system should be is still being worked out across the industry, so I'm treating Parsimony as a moving target: as conventions for tokens, component contracts, and agent interfaces solidify, it will adopt them. I'd rather keep iterating toward the standards as they form than freeze around today's best guess.",
      },
      {
        type: "p",
        text: "A component library tells you what exists. This one also tells an agent what it's allowed to use.",
      },
    ],
  },
};
