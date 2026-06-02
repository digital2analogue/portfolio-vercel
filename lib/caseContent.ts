export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; alt: string; caption?: string; src?: string; naturalSize?: boolean }
  | { type: "image-pair"; images: Array<{ alt: string; caption?: string; src?: string }> }
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
        type: "image",
        alt: "Coded prototype of the Decision Engine interface demonstrating interactive rule-building behaviour",
        src: "/projects/images/c1-decision-coded-prototype.png",
        naturalSize: true,
      },
      {
        type: "p",
        text: "**Try the live prototype:** [full onboarding flow](https://decisioning-table.vercel.app) or [skip straight to the table](https://decisioning-table.vercel.app?demo=1).",
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
      { type: "h2", text: "Live Prototype" },
      {
        type: "p",
        text: "A public-safe, runnable version of the prototype is live: try the [full onboarding flow](https://decisioning-table.vercel.app) or [skip straight to the table](https://decisioning-table.vercel.app?demo=1). It's an open-source extraction of the rule-row pattern, rebuilt in React, TypeScript, and Vite. It strips out the proprietary domain logic, keeps the interaction model intact, and ships the result as a reference implementation for the same class of decisioning interface.",
      },
      { type: "h3", text: "Onboarding: three decisions, one page" },
      {
        type: "p",
        text: "Rather than dropping users into an empty editor, the prototype opens with a guided three-step setup: pick an outcome type, name the model, then choose the data the model is allowed to evaluate. Each step is scoped to a single decision, and the whole flow lives on a single scrollable page so the model's shape stays visible while you build it.",
      },
      {
        type: "image",
        alt: "Step 1 of the onboarding flow: Assign an outcome for ruleset, with six options (Decline, Assign Credit Limit, Require Action, Award Rewards, Accumulate Rewards, Assign Minimum Credit Limit)",
        caption:
          "Step 1: outcome picker. Six mutually exclusive outcomes, each with a one-line description.",
        src: "/projects/images/decisioning-table-onboarding-step1.png",
      },
      {
        type: "image",
        alt: "Step 3 of the onboarding flow: Create your first rule, showing a categorized data-element picker (FINANCIAL, EMPLOYMENT) with checkboxes and a type badge for each element",
        caption:
          "Step 3: categorized data elements. The right pane previews details for the selected element before you commit to it.",
        src: "/projects/images/decisioning-table-onboarding-step3.png",
      },
      { type: "h3", text: "The rule table" },
      {
        type: "p",
        text: "Once setup is done, the model opens into the main editor: a five-row example ruleset showing each rule as a single line with name, data attribute, operator, value, optional companion attributes, and the outcome.",
      },
      {
        type: "image",
        alt: "Main rule table: five rules with colored data attribute badges (Income green, Expense red), operator dropdowns (At least, Less than, Greater than, At most), amount values, and segmented Approve/Deny outcome switches per row",
        caption:
          "Five rules, each editable inline. Colored badges for data attributes; dropdowns for operators; per-row segmented outcome.",
        src: "/projects/images/decisioning-table-rules.png",
      },
      { type: "h3", text: "Segmented Approve / Deny outcome" },
      {
        type: "p",
        text: "Each row's outcome is a segmented two-state control: green Approve on the left, red Deny on the right, with the unselected side rendered as a muted ghost. It's faster than a dropdown for binary outcomes and reads at a glance when scanning a ruleset.",
      },
      {
        type: "image",
        alt: "Close-up of the Outcome column showing per-row segmented switches alternating between Approve (green) and Deny (red) selected states",
        caption:
          "The segmented switch makes a binary outcome scannable. Selected state carries the color; the other side recedes.",
        src: "/projects/images/decisioning-table-outcome-toggles.png",
        naturalSize: true,
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
        naturalSize: true,
      },
      {
        type: "image",
        alt: "Animation showing updated OTKit iconography shared by Debby on LinkedIn",
        src: "/projects/images/casestudy-otkit-opentable-icons-debby-linkedin.gif",
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
  "design-tokens": {
    slug: "design-tokens",
    title: "Building an Agentic Design System",
    scope: "Token architecture, component library, agent tooling",
    timeline: "2026 — ongoing",
    blocks: [
      {
        type: "image",
        alt: "Architecture diagram of the brand-tokens agentic design system: tokens flow through Style Dictionary build, into Lit web components and a merged metadata artifact, then out to humans (Figma, docs) and agents (MCP server), consumed by every site, with a drift-detection feedback loop back to the source",
        caption:
          "The whole system on one canvas: one source of truth, consumed by humans and agents alike. Solid green is shipped; dashed amber is deliberately deferred.",
        src: "/projects/images/ds-architecture.svg",
        naturalSize: true,
      },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "I build most of my work through AI agents now — across chat windows, rarely seeing the whole system at once. So I built a design system for that reality: one where the rules aren't just written for a human reading docs, but encoded so a machine can read the system, build against it, and catch its own mistakes.",
      },
      {
        type: "p",
        text: "**brand-tokens is a design system with an API for agents.** One versioned source of truth flows from raw DTCG tokens, through framework-agnostic web components, to an MCP server an agent can query — and lint against — before it writes a line of UI.",
      },
      {
        type: "note",
        text: "Note: This is personal, living infrastructure — it runs across my own sites (.com, .design, .art, .blog) plus an enterprise UI sub-brand. It's actively evolving, so I've marked what's shipped versus deferred honestly throughout.",
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
        text: "**Browse the live token catalog:** [the full token reference is here](/tokens).",
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Design systems are written for people. Documentation sites, Figma libraries, \"use this, not that\" — all of it assumes a human reading and remembering. But the thing building my UI is increasingly an agent, and an agent doesn't read your docs site.",
      },
      {
        type: "ul",
        items: [
          "Documentation assumes a human reader who remembers the rules",
          "The agent building your UI never visits your docs site",
          "Without the system as data, every agent reinvents — and drift spreads across every repo that consumes it",
        ],
      },
      {
        type: "p",
        text: "The core issue wasn't missing tokens. It was that the system wasn't **legible to a machine**.",
      },
      { type: "hr" },
      { type: "h2", text: "The Architecture" },
      {
        type: "p",
        text: "One repo, one direction of flow — the diagram above is the entire system. The decision that holds it together: **tokens and components version together.** A token rename is a breaking change to every component that uses it, by design, so there's no version skew to chase across separately published packages.",
      },
      {
        type: "ul",
        items: [
          "**Author** — DTCG tokens in three layers: primitives (raw values) → semantic (named roles) → component (scoped). Brand overrides ride the same source.",
          "**Build** — Style Dictionary compiles every brand to CSS; a validation gate rejects hardcoded hex, primitive references, and dangling token aliases — a rename that wasn't propagated fails the build, not production.",
          "**Components** — 18 framework-agnostic Lit web components, all wired to Figma via Code Connect.",
          "**Artifact** — each component's hand-authored metadata merges with its auto-generated Custom Elements Manifest into a single design-system.json.",
          "**Interfaces** — humans read Figma and Markdown docs; agents read an MCP server.",
          "**Consumers** — every site and product repo syncs from the same source.",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "One Source of Truth, Four Brands" },
      {
        type: "image",
        alt: "Four brand panels — base (dark, phosphor green accent), decision-engine (light inversion, blue accent), dot-art (pure-black canvas), and dot-blog (18px reading) — each showing the same UI rendered in its own canvas, surface, text, and accent token values",
        caption:
          "Every brand is the same token graph with a thin override layer. No forks; the difference is data.",
        src: "/projects/images/ds-brands.svg",
      },
      {
        type: "p",
        text: "decision-engine inverts the whole thing to a light enterprise theme with a blue primary; dot-art swaps the canvas to pure black for photography; dot-blog bumps the reading size. No component is forked to make any of this happen. The difference between brands is **data** — a small override file — not code.",
      },
      { type: "hr" },
      { type: "h2", text: "Components as Contracts" },
      {
        type: "image",
        alt: "A rendered badge.meta.json file with callouts highlighting tokensUsed (which tokens the component may touch), rules (the constraints it must obey), and accessibility (the ARIA pattern and WCAG criteria it implements)",
        caption:
          "badge.meta.json — the component's machine-readable rulebook. get_component() returns this verbatim.",
        src: "/projects/images/ds-meta-json.svg",
        naturalSize: true,
      },
      {
        type: "p",
        text: "Each component ships its own rulebook. badge.meta.json doesn't just describe a badge — it declares exactly which tokens the component may touch, which rules apply to it, and which ARIA pattern and WCAG criteria it implements. The metadata is the spec, and it's the same file the agent reads.",
      },
      {
        type: "p",
        text: "All 18 components carry an auto-generated Custom Elements Manifest — the mechanical API surface an agent needs to wire one up. Three — badge, button, and input — go further with a hand-authored meta.json that layers the token, rule, and accessibility contract on top. The rest are built and Figma-wired, with that richer contract rolling out behind them.",
      },
      { type: "hr" },
      { type: "h2", text: "check_usage: Governance, Moved Upstream" },
      {
        type: "image",
        alt: "The check_usage MCP tool: an input panel of agent-proposed CSS containing a hardcoded hex and a primitive-token reference (both flagged red), feeding into an output panel listing the two rule violations returned by the system",
        caption:
          "Paste a snippet, get back every violation. Catch the mistake before it ships, not after.",
        src: "/projects/images/ds-check-usage.svg",
      },
      {
        type: "p",
        text: "Most design-system governance is detection after the fact — a linter in CI, a reviewer catching drift in a pull request. **check_usage moves that upstream.** Before an agent commits to a pattern, it can hand the system a snippet and get back every violation: the hardcoded hex, the primitive reference, the deprecated token.",
      },
      {
        type: "p",
        text: "It's a small tool with a specific point of view: catch the violation before it multiplies, not after.",
      },
      { type: "hr" },
      { type: "h2", text: "Honest Status" },
      {
        type: "p",
        text: "Knowing what *not* to build yet is part of the design. Here's where things actually stand.",
      },
      { type: "h3", text: "Shipped" },
      {
        type: "ul",
        items: [
          "Three-layer token architecture across four brands",
          "18 Lit web components, all wired to Figma via Code Connect",
          "MCP server with three tools: list_components, get_component, check_usage",
          "One shared rule set behind every checker — the build gate, the MCP's check_usage, and the consumer drift scan all import the same rules, so they can't disagree",
          "A CI gate on every change: schema validation, lint rules, token-reference resolution, a deterministic artifact check, and 229 tests",
          "WCAG AA contrast verified across every token pairing",
        ],
      },
      { type: "h3", text: "Deliberately deferred" },
      {
        type: "ul",
        items: [
          "Hand-authored meta.json on all 18 components — the Custom Elements Manifest already covers all 18; the richer token/rule/a11y contract is on three",
          "Publishing the packages to npm (distribution is still a manual token sync today)",
          "The self-healing loop — drift signals that auto-open pull requests",
        ],
      },
      {
        type: "p",
        text: "The grep Action proves the drift signal exists before I invest in automating the cure. That sequencing is intentional, not a backlog.",
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "Every design system I'd built before this was about making complexity legible to people. This one asked a newer question: what does a system look like when its most active reader is a machine?",
      },
      {
        type: "p",
        text: "The answer wasn't more documentation. It was **structure** — tokens as data, components as contracts, rules as something you can query.",
      },
      {
        type: "p",
        text: "A library tells you what exists. This tells an agent what's allowed.",
      },
    ],
  },
};
