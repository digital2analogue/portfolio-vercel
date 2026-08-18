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
  | { type: "embed"; src: string; title: string; caption?: string; aspectRatio?: string; poster?: string;
      /** Natural width of the embedded document. When the prototype cannot
       *  reflow below this (a hard min-width), the frame lays the iframe out
       *  at this width and scales it to fit rather than cropping it. */
      contentWidth?: number }
  | { type: "outcome-demo"; caption?: string }
  /** `cite` marks the quote as someone ELSE's testimony and renders an
   *  attribution line. Leave it off for River's own pull-quotes — the two
   *  read differently on purpose. */
  | { type: "quote"; text: string; cite?: string }
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
    title: "Designing a Decision Engine for Enterprise Policy",
    scope: "System strategy, component architecture, governance",
    timeline: "5 months",
    blocks: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "Policy analysts at Capital One built complex decision logic in spreadsheets: rules copy-pasted between tabs, compliance constraints cross-referenced by hand. I led the design systems strategy that replaced that workflow with a modular, compliance-ready rules interface.",
      },
      {
        type: "note",
        text: "Note: Details have been intentionally abstracted to respect confidentiality while preserving decision-making and impact.",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Scope", "System strategy, component architecture, governance"],
          ["Team", "2 designers, 2 PMs, engineering leads"],
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
        text: "The actual thing, before the write-up: a public-safe, runnable prototype. Drag a rule to reorder, flip an outcome, edit any cell, or open the [full onboarding flow](https://decisioning-table.vercel.app).",
      },
      {
        type: "embed",
        src: "https://decisioning-table.vercel.app/?demo=1",
        title: "Live Decision Model rules table: drag a rule to reorder, flip Approve/Deny, edit any cell",
        poster: "/projects/images/decisioning-table-rules.png",
        aspectRatio: "16 / 10",
        caption:
          "The live prototype, not a screenshot. Drag a rule by its handle to reorder, flip the Approve/Deny outcome, edit any cell. Reorder works on touch too.",
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
      { type: "h2", text: "Component Deep Dive: Rule Cell" },
      {
        type: "p",
        text: "One critical interaction pattern encapsulated complex decision logic into a single, reusable unit.",
      },
      {
        type: "demo",
        demo: "rule-cell",
        frameLabel: "Decision engine · Live component",
        caption:
          "The rule cell's vocabulary, live instead of a component sheet: swap the attribute badge, pick an operator, edit the value, flip the outcome. Hover the row or tick the checkbox for its hover and selected states.",
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
        text: "Each row maps a data attribute to an operator, a value, and an outcome. Inline editing (badge tap, dropdown, direct input) replaced the modal-heavy workflow, cutting the path to a saved rule from eight clicks to three.",
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
        text: "The prototype above is an open-source extraction of the rule-row pattern (React, TypeScript, Vite) with the proprietary domain logic stripped and the interaction model intact. A few interactions worth calling out:",
      },
      { type: "h3", text: "Onboarding: three decisions, one page" },
      {
        type: "p",
        text: "Instead of an empty editor, a guided three-step setup: pick an outcome, name the model, choose the data it may evaluate. Each step one decision, all on one scrollable page.",
      },
      {
        type: "embed",
        src: "https://decisioning-table.vercel.app/",
        title: "Live onboarding flow: assign an outcome, name the model, pick its data elements",
        poster: "/projects/images/decisioning-table-onboarding-step1.png",
        aspectRatio: "16 / 10",
        caption:
          "The live onboarding flow: pick an outcome, name the model, choose its data elements, and land in the table.",
      },
      { type: "h3", text: "The rule table" },
      {
        type: "p",
        text: "Setup done, the model opens into the editor shown at the top of this page. One rule per line: name, attribute, operator, value, outcome.",
      },
      { type: "h3", text: "Segmented Approve / Deny outcome" },
      {
        type: "p",
        text: "Each row's outcome is a two-state segmented control: green Approve, red Deny, the unselected side a muted ghost. Faster than a dropdown, readable at a glance.",
      },
      {
        type: "outcome-demo",
        caption:
          "The real control, not a screenshot. Flip any row's outcome and the pill springs across, settling into the semantic color. Selected state carries the color; the other side recedes to a muted ghost.",
      },
      { type: "h3", text: "Split-button progressive disclosure" },
      {
        type: "p",
        text: "The primary CTA is a split button: **+ Add rule** on the main face, a chevron for the secondary Add existing rule. The default stays one click away without burying the alternative.",
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
          "A foundation for future platform growth",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "In complex enterprise systems, clarity is a performance feature. The work is **making complexity legible**.",
      },
    ],
  },
  "ot-design-system": {
    slug: "ot-design-system",
    title: "Building OTKit: From Drift to Discipline",
    scope: "iOS, Android, Web",
    timeline: "~1 year focused engagement",
    blocks: [
      {
        type: "image",
        alt: "OTKit Design System hero: overview of the design system River built at OpenTable spanning iOS, Android, and web",
        src: "/projects/images/otkit-ds-hero.png",
      },
      {
        type: "stats",
        items: [
          { value: "25%", label: "Less QA time" },
          { value: "≈$98K/yr", label: "Recovered" },
          { value: "+2.15%", label: "Diner bookings" },
        ],
      },
      {
        type: "meta",
        rows: [
          ["Scope", "iOS, Android, Web · 6 product teams"],
          ["Shipped", "Tokens, type + icon systems, a brand refresh"],
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "OTKit existed on paper but lacked cohesion, governance, and trust. The mandate: **turn a drifting system into an operational platform** teams actually relied on. It served three users at once.",
      },
      {
        type: "ul",
        items: [
          "**The diner** books a table in seconds, once a month. Consumer-grade craft, fast by default.",
          "**The front-of-house host** runs the floor from an iPad, eight hours a shift. Density, zero tolerance for error.",
          "**Design and engineering** — six teams consuming tokens, components, docs. The system succeeds when their work gets faster.",
        ],
      },
      { type: "hr" },
      { type: "h2", text: "Three sources of truth, ≈$390K a year" },
      { type: "p", text: "Drift was expensive and invisible. Surveys and 1:1 interviews found:" },
      {
        type: "ul",
        items: [
          "Three sources of truth — Storybook, Figma libraries, inline docs — reconciled by hand, separately, per team",
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
        text: "We put the cost of drift at ≈$390K a year in visual QA time, across design and engineering.",
      },
      {
        type: "p",
        text: "Costed from the survey: ~5 engineering hours a week across 14 people (**≈$273K**), ~3 design hours across 10 (**≈$117K**), at $75/hour. Naming it in dollars is what made the work fundable.",
      },
      { type: "hr" },
      { type: "h2", text: "37 people, one answer" },
      {
        type: "p",
        text: "A 37-person survey across design, product, and engineering put numbers on it:",
      },
      { type: "h3", text: "Everyone was building one-offs" },
      {
        type: "p",
        text: "**100%** of iOS designers were creating one-off components often or occasionally, vs **60%** on web. Unsurprising, given a mature web library (Buffet) and nothing comparable for native.",
      },
      {
        type: "quote",
        text: "I think iOS lacks the rich component system that web has (Buffet), and that poses some challenges for us.",
        cite: "Restaurant iOS engineer",
      },
      { type: "h3", text: "Four to eight rounds, every release" },
      {
        type: "p",
        text: "**75% of Restaurant web designers** spent **4–8 rounds** per release clarifying styling with engineering; **100% of Diner web designers** needed **0–3**.",
      },
      {
        type: "p",
        text: "Interviews surfaced the same insight from both sides: unclear documentation, scattered sources of truth, no shared component language; much of the style guide lived in designers' heads.",
      },
      { type: "hr" },
      { type: "h2", text: "Foundations first, without stopping delivery" },
      {
        type: "p",
        text: "Six teams were shipping in parallel, on legacy patterns embedded in production, across three platforms. Nothing could pause. So I went **foundations first** — the layer teams could adopt inside an active codebase, without a rewrite:",
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
      { type: "h2", text: "Tokens, type, icons" },
      {
        type: "p",
        text: "Foundations made consistency possible without rewrites: adoption could happen across active codebases.",
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
        alt: "Screenshot of semantic color token migration tool",
        caption:
          "Establishing semantic tokens created a single source of truth across platforms and reduced downstream inconsistencies.",
        src: "/projects/images/casestudy-otkit-colormappingtool.png",
      },
      { type: "h3", text: "Twenty-two states, eleven tokens" },
      {
        type: "p",
        text: "**22 reservation statuses needed color** — plus data viz, plus white-label theming. Hyper-specific tokens read precisely but couldn't scale across two products, so statuses bind to the semantic accent ramps instead: **eleven tokens carry all twenty-two states**. Shipped on time, zero new colors.",
      },
      {
        type: "demo",
        demo: "reservation-status",
        frameLabel: "OTKit · Reservations · Floor view",
        caption:
          "Live component, rebuilt from the OTKit source. Every state maps to an existing semantic token.",
      },
      { type: "h3", text: "The same system, denser" },
      {
        type: "p",
        text: "The **floor plan** is the denser half of the same screen: table tiles color-coded by the same palette. Labels sit *on* the color, so each tile pairs its fill with its own `foreground/on-*` token to stay legible.",
      },
      {
        type: "demo",
        demo: "table-status",
        frameLabel: "OTKit · Floor plan · Table status",
        caption:
          "The floor-plan counterpart to the reservation button. Select a tile to inspect its tokens and live contrast ratio.",
      },
      { type: "h3", text: "39 fonts, one scale" },
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
        type: "p",
        text: "The replacement was contextual: size, weight and family defined per platform context, plus Apple Dynamic Type. A/B testing showed a **+2.15% increase in diner bookings** — +600 weekly net bookers — on pages using dynamic type.",
      },
      {
        type: "video",
        alt: "Dynamic text sizing from small to large on an iOS iPhone, driven by the user's accessibility settings",
        caption: "Animation of dynamic text sizing implemented on iOS",
        src: "/projects/images/casestudy-otkit-dynamic-text.mp4",
        poster: "/projects/images/casestudy-otkit-dynamic-text-poster.jpg",
      },
      {
        type: "p",
        text: "It came with the rest of the native contract: **44px minimum touch targets**, platform-aware scales, and the same tokens as web.",
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
      { type: "h3", text: "One grid, every glyph" },
      {
        type: "ul",
        items: [
          "Introduced shape-based icon grids — one optical size, equal optical area across keyshapes",
          "Unified keyshapes for indicators",
          "Set the drawing rules explicitly: 1.5px stroke replacing the deprecated 2.0, 2dp corners outside and square inside",
          "Made detail a function of size — 24px earns tick marks, 16px loses them",
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
        type: "p",
        text: "The rules had reasons. The 2dp outer corner echoes the OpenTable logo; the detail budget answers a five-second recognition test — which is why 24px earns tick marks that 16px cannot afford.",
      },
      {
        type: "p",
        text: "The result: a **searchable, themeable SVG system** shared across native and web teams. Duplication dropped, accessibility parity improved.",
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
          "Two new families — **Nantes** for editorial display, **Haffer** for labels, body, and product UI. Brandon retired.",
          "A refreshed color palette",
          "Visual distinction for Iconic restaurants",
        ],
      },
      {
        type: "p",
        text: "Every text style already pointed at one family token, so the swap was a **re-binding, not a redraw** — **two variable fonts replaced six static cuts**. The one judgement call was the CTA: **570, not the 600 the old scale implied**, tuned to Haffer's optical weight.",
      },
      {
        type: "image",
        alt: "OTKit type specimen: Nantes set as editorial display reading 'Find your table for any occasion', above Haffer's weight axis showing 430 body, 530 label, 570 title and 600 CTA, with a slider marking 570 as the shipped CTA weight between 400 and 620, and a product-UI row of Haffer buttons",
        caption:
          "Nantes for editorial display, Haffer for product UI.",
        src: "/projects/images/otkit-type-haffer-nantes.png",
      },
      { type: "h3", text: '"Black is the new red"' },
      {
        type: "p",
        text: "Red meant error — and it was also our primary action. One hue doing two contradictory jobs. Black solved both: elegance for Iconic, and red freed to mean danger again. Every black-button state was checked against AA, not just the default.",
      },
      {
        type: "p",
        text: "Checking states instead of defaults is what turns up real problems. `background/action-hover` resolves to the lighter step of the brand ramp, so a white label on a hovered primary button measures **3.24:1** on Restaurant teal and **3.57:1** on Diner red. AA asks for 4.5:1 and makes no exception for hover. Only disabled controls are exempt. The demos on this page render the real token rather than a safer substitute, so that state fails here too, and this site's contrast gate reports it as an accepted failure rather than quietly passing.",
      },
      {
        type: "p",
        text: "Because brand decisions were encoded as token values, the system absorbed a major brand shift without teams rewriting components.",
      },
      { type: "hr" },
      { type: "h2", text: "One component, three brands" },
      {
        type: "demo",
        demo: "brand-theme",
        frameLabel: "OTKit · Brand collections · Switch and compare",
        caption:
          "The same card under all three OTKit brand collections. The markup, the components, and the other 278 tokens never change.",
      },
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
        text: "Iconic, the premium tier: full-bleed photography, dark wine-toned time slots, sticky booking. Same tokens, same components, different values.",
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
      { type: "h2", text: "What it returned" },
      {
        type: "ul",
        items: [
          "**50% fewer Figma libraries**",
          "**27% lift** in clarity around Figma component sources, in the follow-up survey",
          "One design language across 6 teams — and a full brand refresh absorbed without a rewrite",
        ],
      },
      {
        type: "p",
        text: "The ≈$98K a year is that 25% QA reduction, priced against the $390K drift was costing.",
      },
      { type: "hr" },
      { type: "h2", text: "Adoption came through advocacy, not enforcement" },
      {
        type: "p",
        text: "Two people can't scale to six teams — a **designer–engineer pair per platform** could. Each pair championed the system locally and carried friction back; contribution ran one path every time: propose, review, merge. That friction fed a quarterly roadmap to the director, keeping the cost of drift visible to the people funding it.",
      },
      {
        type: "image",
        alt: "Photo from OTKit design ambassadorship program",
        caption: "Design ambassadors in product teams acted as system advocates and real-world feedback channels.",
        src: "/projects/images/casestudy-otkit-ambassadorship.png",
      },
      {
        type: "p",
        text: "Slack buried system updates in noise. So every release shipped an email instead — what changed, why, a demo, and how to migrate. **Every other team started one after this.**",
      },
      {
        type: "image",
        alt: "OTKit release-notes email: a Foundation v1.0.1 announcement headed 'Variables are now in Figma', with links to a theming guide and recorded training sessions, and an embedded 38-second demo of theme modes switching live",
        caption: "One release, explained. A direct line to the system's users.",
        src: "/projects/images/otkit-newsletter-release-notes.png",
      },
      {
        type: "quote",
        text: "I wanted to mention how helpful it has been having River support me on the design systems front. His depth of knowledge has been invaluable for our team.",
        cite: "Jordon · Restaurant Design Ambassador",
      },
      {
        type: "p",
        text: "Trust came from follow-through: issues answered fast, breaking changes migrated for teams. That turned skeptics into advocates.",
      },
      { type: "hr" },
      { type: "h2", text: "What I'd do differently" },
      { type: "h3", text: "Tokens before Figma had Variables" },
      {
        type: "p",
        text: "We started before Figma shipped Variables, managing tokens through naming conventions and manual syncing. We migrated fast when Variables arrived, but the gap cost early momentum. Next time: clearer expectations about interim tooling from the start.",
      },
      { type: "h3", text: "Remote teams, lost context" },
      {
        type: "p",
        text: "With teams across North America, Europe, and Asia, updates got lost and context didn't travel. The newsletter became our most effective channel. I'd start it, and the async-first habits, much earlier.",
      },
      { type: "h3", text: "Scaling myself" },
      {
        type: "p",
        text: "System work kept getting pulled into feature support, and without boundaries it was easy to become the bottleneck. Ambassadors helped but weren't free — their hours were a real cost against product delivery. Formal sessions worked at first; what drove adoption was loosening them into jams. I'd draw that line earlier.",
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
      {
        type: "p",
        text: "OpenTable's reservation details view was the most legacy-styled screen in the product: dense, fragmented, expensive to maintain, and used by operators every shift. I led the redesign. The brief was to modernize it without losing the density they rely on.",
      },
      {
        type: "image",
        alt: "Reservation Details, before-and-after comparison. Legacy flat layout on the left; the redesigned card-based hierarchy on the right.",
        caption: "iPad to iPhone. Reverse-engineering OpenTable's Front of House iPad app to iPhone and Android.",
        src: "/projects/images/ot-reservations-native-ios-android.png",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Team", "3 designers, 6 engineers, 2 PMs"],
          ["Platforms", "Mobile · tablet · desktop"],
        ],
      },
      { type: "hr" },
      {
        type: "stats",
        items: [
          { value: "−18%", label: "Host time on the card, week 6" },
          { value: "11s → 7s", label: "Time to the right note" },
          { value: "35", label: "Opt-in restaurant groups, worldwide" },
        ],
      },
      { type: "hr" },

      { type: "h2", text: "Three tempos, one record" },
      {
        type: "p",
        text: "The same reservation is read by three people at three speeds. **The host** at the door has seconds per guest, standing, on an iPad. **Front of house** runs the floor all shift on iPhone and iPad, watching live statuses, allergies and notes. **Back of house** returns to the same record between shifts on the web, slower and in more depth. Build the card once; let each surface decide how much of it to show.",
      },
      {
        type: "p",
        text: "That framing moved the product, not just the screen. The tool had stayed tethered to the host stand even though staff work the floor, not a desk. Mobile was designed first and iPad second, so one logic carried across both.",
      },
      {
        type: "image-pair",
        images: [
          {
            alt: "Screenshot of the redesigned Guest Profile component in the Back of House web view",
            caption: "The same Guest Profile component in the Back of House web view, where there is room for more.",
            src: "/projects/images/ot-reservations-guest-profile-boh.png",
          },
          {
            alt: "Close-up screenshot of the Guest Profile component showing structured guest data in Back of House",
            caption: "Close up: structured guest data, scannable at desk pace.",
            src: "/projects/images/ot-reservations-guest-profile-boh-detail.png",
          },
        ],
      },
      { type: "hr" },

      { type: "h2", text: "A dumping ground by accumulation" },
      {
        type: "p",
        text: "Years of shipped features had each found somewhere to live, and restaurants run their whole shift on the result. Guest details and visit history sat **hidden behind tabs**, so they were rarely seen. **Booked** and **Assign table** were real actions styled as flat panels, so the controls did not read as controls. Experiences got the worst of it. *4× Friday Whiskey Tasting*, the highest-value thing on the booking, rendered as plain text with no visual weight.",
      },
      {
        type: "image",
        alt: "The legacy reservation detail screen on iPad: guest details behind a tab strip, Booked and Assign table rendered as flat grey panels, and 4 x Friday Whiskey Tasting shown as an unstyled text link",
        caption: "The screen as it stood. Tabs hiding the record, actions that read as panels, and a high-value experience set as plain text.",
        src: "/projects/images/ot-reservations-legacy-detail.png",
      },
      {
        type: "p",
        text: "Three walls shaped every decision after that. **Zero tolerance for data loss or regressions**, because a missed allergy tag is a real guest at a real table. **No retraining budget**, because operators live here every shift under time pressure. **Distributed ownership**, because the flow spanned multiple engineering teams and had to be adoptable piecewise.",
      },
      { type: "hr" },

      { type: "h2", text: "An architecture before a layout" },
      {
        type: "p",
        text: "Rather than redesigning the page, we modelled it. The reservation card became zones for status, experiences, guest profile, visit notes and tags, and guest history. Each one could absorb new data without another redesign. What drove that bet was everything already queued: multiple guests, Venga and sentiment data, visit counts, takeout and delivery spend, POS spend per occasion, and third-party integrations.",
      },
      {
        type: "quote",
        text: "We want to think of elements in the reso card as modular — utilized in other areas of OT.",
        cite: "Stakeholder feedback · FOH modernization review",
      },
      {
        type: "diagram",
        src: "/projects/images/ot-reservations-ia-zones.svg",
        alt: "Zone model of the reservation card. Three top-level zones: visit notes and tags, containing reservation and table status and experiences; guest profile, containing contact card, guestbook notes, guest profile integrations for third-party guest notes, and guest history; and visit history.",
        caption: "The card as zones, not a layout. Status and Experiences still sat inside the notes zone here, which is the thing the rail later corrected.",
      },
      { type: "p", text: "Each zone then shipped as a repeatable pattern:" },
      {
        type: "ul",
        items: [
          "**Guest profile**, identity first and readable in one glance",
          "**Tags**, structured and scannable service data",
          "**Guest message**, the guest's own words verbatim",
          "**Notes tabs**, five categories and one tap",
          "**Notes as cards**, guestbook with newest first",
        ],
      },
      {
        type: "image",
        alt: "Annotated diagram showing how guest and reservation information was made modular across Back of House, Front of House, Web, iOS, and Android",
        caption: "The same patterns annotated against the shipped card: what each one had to carry to work on desktop and on iPad.",
        src: "/projects/images/ot-reservations-modularity.png",
      },
      { type: "hr" },

      { type: "h2", text: "Options, weighed in the open" },
      {
        type: "p",
        text: "The actions were the contested decision. Where should **Booked**, **Assign table** and the rest actually live? Anchoring them to the foot of the card buried them below the fold as soon as notes ran long. Leading with them crowded the guest header that hosts scan first. In user testing the **right rail** won clearly. Users read it as *where actions live* without being prompted.",
      },
      {
        type: "diagram",
        src: "/projects/images/ot-reservations-action-options.svg",
        alt: "The three placements considered for the reservation actions. Option 01, a right rail, was chosen: status and actions get a persistent surface the floorplan could later reuse. Option 02, a bottom bar, anchors actions to the card foot where they are buried below the fold once notes run long. Option 03, actions on top, leads the card but crowds the guest header hosts scan first.",
        caption: "Three placements, one chosen. Each option is named by what it costs, not by what it looks like.",
      },
      {
        type: "p",
        text: "Two tradeoffs came with it. Status and Experiences moved into a rail the floorplan could reuse, which means related information now spans two panels; one reusable rail beat two bespoke ones. Notes moved off a long scroll into a segmented control, which puts content behind a tab; scanning beat scrolling.",
      },
      { type: "hr" },

      { type: "h2", text: "Shipped, in hand" },
      {
        type: "embed",
        src: "/projects/prototypes/ot-reservations-ipad-foh.html",
        title: "Front-of-House reservation detail on iPad — live prototype on OTKit components",
        // Required at ≤700px: the mobile fallback is a poster-image link whose
        // CTA is absolutely positioned, so without this the anchor has no
        // in-flow content and collapses to its borders.
        poster: "/projects/images/ot-reservations-ipad-foh-poster.png",
        // The prototype declares min-width: 1240px, so it is laid out at its own
        // width and scaled into the case column instead of being cropped.
        contentWidth: 1240,
        aspectRatio: "1240 / 900",
        caption: "Front of house, on iPad. The same record, re-composed. The tablet adds chrome, not content.",
      },
      {
        type: "demo",
        demo: "reservation-detail",
        frameLabel: "OTKit · iOS Restaurant, as shipped",
        caption: "Live, not filmed. Every zone is a repeatable pattern.",
      },
      { type: "hr" },

      { type: "h2", text: "What it returned" },
      {
        type: "p",
        text: "The redesign earned its rollout one dinner rush at a time: a pilot with critical restaurant groups, feedback from real service, then a rollout with the risk contained. **Zero regressions in critical workflows.**",
      },
      {
        type: "quote",
        text: "This [design] feels much more intuitive to use. Though at first the change felt a little confusing, once I got the hang of the tabs I was able to find the notes I needed much faster. I also appreciated the reservation status being easy to find outside of the reservation notes.",
        cite: "Host · large restaurant group, pilot",
      },
      {
        type: "p",
        text: "35 opt-in restaurant groups worldwide, a net gain by week 6. Host time on the card fell **18%**, and time to the right note went from **11 seconds to 7**. Asked whether *“the redesign made this faster,”* pilot operators agreed by workflow: **71%** for seating, **68%** for saving time overall, **64%** for providing hospitality.",
      },
      {
        type: "p",
        text: "It was also OTKit's first test at real product scale: shared tokens and components across three platforms, fewer custom overrides, and a tighter loop between the system and the teams consuming it.",
      },
      {
        type: "image",
        alt: "Screenshot of OTKit documentation site showing how to implement inline theming for legacy screens",
        caption: "Inline theming, added to carry mixed legacy screens before full light and dark themes were prioritized.",
        src: "/projects/images/ot-reservations-inline-theming.png",
      },
      { type: "hr" },

      { type: "h2", text: "What I'd do differently" },
      {
        type: "p",
        text: "Categorize the IA by **actionability** from day one. Things you *act on*, like reservation and table status and experiences, belong in the rail. Things you *refer to*, like visit notes and tags, guest profile and visit history, belong in the card. That is the call that earned the rail, and it took longer to find than it should have.",
      },
      {
        type: "diagram",
        src: "/projects/images/ot-reservations-actionability.svg",
        alt: "The same information re-sorted by actionability. Act on it, in the rail: reservation and table status, experiences. Refer to it, in the card: visit notes and tags, guest profile, visit history.",
        caption: "The same inventory, sorted by what you do with it. This is the cut I would start from next time.",
      },
    ],
  },
  "system": {
    slug: "system",
    title: "Building Parsimony, an Agentic Design System",
    scope: "Token architecture, component library, agent tooling",
    timeline: "Ongoing",
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
        type: "p",
        text: "It's also a sequel. [OTKit](/work/ot-design-system) was this discipline built for people: docs humans read, governance by hand. Parsimony inverts it — a contract machines build from, with code and Figma generated from it as the committed end state.",
      },
      {
        type: "note",
        text: "Note: A personal project, live across my own sites plus an enterprise UI sub-brand. Shipped vs deferred is marked throughout; the [public roadmap](https://github.com/digital2analogue/parsimony/milestones) tracks what's next.",
      },
      { type: "hr" },
      {
        type: "meta",
        rows: [
          ["Scope", "Token architecture, components, agent tooling"],
          ["Stack", "DTCG · Style Dictionary · Lit · MCP · Figma Code Connect"],
          ["Status", "Live and evolving"],
        ],
      },
      {
        type: "p",
        text: "**Browse the [live token catalog](/tokens)**: this site consumes the system it documents.",
      },
      { type: "hr" },
      {
        type: "stats",
        items: [
          { value: "27", label: "Framework-agnostic components" },
          { value: "4", label: "Brands from one source" },
          { value: "95%", label: "Governed agent runs ship clean, measured" },
        ],
      },
      { type: "hr" },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Design systems are written for people: docs sites, Figma libraries, \"use this, not that.\" But the thing building my UI now is an agent, and an agent doesn't read your docs site.",
      },
      {
        type: "p",
        text: "The problem was never missing tokens. It was that nothing in the system was **readable by a machine**.",
      },
      {
        type: "diagram",
        alt: "Four agent runs of the same prompt — add a confirm button, use the design system — each producing a different wrong button: one uses the near-miss hex #22C55E instead of a token, one invents a gradient fill and adds an emoji, one sets font-family cursive, one renames the action and renders it as a link. Kicker: not hallucinations — every agent had read the docs. Prose doesn't govern.",
        caption:
          "Same prompt, four ungoverned runs, four opinions. Drift, not hallucination — the failure mode this system targets.",
        src: "/projects/images/ds-ungoverned.svg",
      },
      { type: "hr" },
      { type: "h2", text: "The Architecture" },
      {
        type: "p",
        text: "**Primitives hold values. Semantics name roles. Components render decisions. UI code never touches a hex.** That's the whole layer model — the rest is enforcement.",
      },
      {
        type: "p",
        text: "One repo, one direction of flow. Tokens and components version together, so a token rename is a breaking change by design.",
      },
      {
        type: "ul",
        items: [
          "**Author.** DTCG tokens: primitives → semantic roles. Brands re-point the roles.",
          "**Build.** Style Dictionary compiles every brand to CSS. A gate rejects hex, primitive refs, and dangling aliases — a bad rename fails the build, not production.",
          "**Components.** 27 framework-agnostic Lit web components. Code Connect mappings are authored for 22 and held to each component's real prop unions by a build gate — unpublished, because Code Connect needs a Figma Enterprise plan.",
          "**Artifact.** Hand-authored metadata + generated manifest merge into one design-system.json.",
          "**Interfaces.** Humans read Figma and docs; agents read an MCP server.",
          "**Consumers.** Every site pulls from one source, as an installable package.",
        ],
      },
      {
        type: "diagram",
        alt: "Token resolution diagram: a semantic token (background.success-alt) resolves to a primitive (color.green.chip = #0F2016), rendering as a success badge. A footer rule states UI references semantic roles, never primitives, and brand overrides re-point the semantic role without touching components.",
        caption:
          "Two tiers, one value. UI writes against named semantic roles, and each role resolves to exactly one raw primitive. Brand overrides re-point the semantic role; the components never change.",
        src: "/projects/images/ds-token-tiers.svg",
      },
      { type: "hr" },
      { type: "h2", text: "One Source of Truth, Four Brands" },
      {
        type: "diagram",
        alt: "Four brand panels: base (dark, phosphor green accent), decision-engine (light inversion, blue accent), dot-art (pure-black canvas), and dot-blog (18px reading). Each shows the same UI rendered in its own canvas, surface, text, and action token values, with the filled Action button labeled background-action and foreground-on-action.",
        caption:
          "Every brand is the same token graph with a thin override layer. No forks; the difference is data.",
        src: "/projects/images/ds-brands.svg",
      },
      {
        type: "p",
        text: "Decision-engine flips to a light enterprise theme with a blue primary; dot-art goes pure black for photos; dot-blog bumps the reading size. None of it forks a component — each brand is a small override file.",
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
        text: "Each component ships its own rulebook: the tokens it may touch, the rules that bind it, the ARIA pattern it implements. The spec and what the agent reads are the same file — prop descriptions come from the code's JSDoc, so the contract can't drift from the implementation.",
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
        text: "Docs generate from the same metadata the agent reads. Mechanical sections regenerate, hand-written prose is preserved, and CI fails the build if a change leaves its docs stale.",
      },
      { type: "hr" },
      { type: "h2", text: "check_usage: Governance, Moved Upstream" },
      {
        type: "p",
        text: "Design-system checks usually happen after the fact. **check_usage moves them earlier**: hand the system a snippet before the code ships, get back every violation.",
      },
      {
        type: "demo",
        demo: "check-usage",
        surface: "dark",
        frameLabel: "Parsimony · check_usage · Playground",
        caption:
          "Live: edit the snippet and watch the violations update. A faithful port of the static rules — the deployed MCP tool runs the same set against the live registry.",
      },
      {
        type: "p",
        text: "The same rules run in three places — this check, the build gate, the drift scan — so the answer an agent gets here is the one the build enforces later.",
      },
      { type: "hr" },
      { type: "h2", text: "An Agent, Self-Correcting" },
      {
        type: "diagram",
        alt: "A terminal-style agent session. The agent calls get_component(\"rr-badge\") and gets back the contract (props, 23 semantic tokens, rules, a11y). It drafts a badge with hardcoded hex values, calls check_usage, and gets two no-hex violations quoting the verbatim rule message. It then revises to <rr-badge variant=\"success\">Active</rr-badge> and re-runs check_usage, which returns no violations.",
        caption:
          "One session, four steps: get_component, a hand-rolled draft, check_usage, a fix. The violation text is the literal output of the shared rule set, not a mockup.",
        src: "/projects/images/ds-agent-loop.svg",
      },
      {
        type: "p",
        text: "The whole argument in one session: the agent asks what a badge is, drafts it with raw hex, gets back the exact violations the build would reject, and ships the fix instead. None of it is staged.",
      },
      { type: "hr" },
      { type: "h2", text: "Governance, Measured" },
      {
        type: "p",
        text: "\"Agents follow the system better when the system is data\" was an assertion until I measured it. Twenty realistic UI prompts, two arms, a fresh agent per run. The governed arm got the compiled context packs; the ungoverned arm got \"Use the design system.\" Every output scored by the same rule set that gates the build — no hand grading.",
      },
      {
        type: "stats",
        items: [
          { value: "95%", label: "Governed runs clean (19 of 20)" },
          { value: "70%", label: "Ungoverned runs clean (14 of 20)" },
          { value: "5.5×", label: "Fewer violations per governed run" },
        ],
      },
      {
        type: "p",
        text: "Neither arm invented a token that doesn't exist — the failure mode was drift, not fabrication. The one dirty governed run exposed two gaps in the packs; both became issues the next day. The eval is committed and re-runnable, so the number gets measured again as the system grows.",
      },
      { type: "hr" },
      { type: "h2", text: "The Contract Caught a Shipped Bug" },
      {
        type: "p",
        text: "The newest layer of the contract is **anatomy**: each component declares which foreground token sits on which background token, in every state. Contrast stops being a convention the system hopes holds and becomes a pairing the gate checks against what actually renders.",
      },
      {
        type: "p",
        text: "The first pass found a real defect. The badge's accent variants had shipped unreadable under the light enterprise brand — as low as 1.39:1 — because the brand re-tinted the fills without re-tinting the text. The gate had those pairings on an exclusion list, so nothing ever looked. Anatomy named the pair the badge actually renders, and the gate failed it immediately.",
      },
      {
        type: "diagram",
        alt: "Three-panel before-and-after of the badge contrast bug. Left: the shipped amber badge under the enterprise light brand — label #FCD34D on an #FFFBEB fill, 1.39:1 against the 4.5:1 requirement, failing, with the pairing sitting on a brand exclusion list. Middle: the anatomy declaration — part: label, foreground on background, every state, every brand — the pair the badge actually renders. Right: the patched badge, label overridden to #92400E on the unchanged fill, 6.84:1, WCAG AA pass, exclusion list deleted, rolled to three production sites the same day.",
        caption:
          "The amber accent variant, before and after — real values, not a mockup.",
        src: "/projects/images/ds-anatomy-catch.svg",
      },
      {
        type: "p",
        text: "The fix took one evening: three brand-side overrides, the exclusion list deleted, a patch release rolled to all three consumer sites the same day.",
      },
      { type: "quote", text: "A docs site promises. A contract catches." },
      { type: "hr" },
      { type: "h2", text: "Decisions & Tradeoffs" },
      {
        type: "p",
        text: "Three decisions, and what each one cost.",
      },
      { type: "h3", text: "Distribution: public npm over GitHub Packages" },
      {
        type: "p",
        text: "GitHub Packages needs a login even for public installs — a token just to download tokens. Public npm needs none, and tokens are CSS that ships to the browser anyway.",
      },
      { type: "h3", text: "The agent interface: MCP over docs or a REST API" },
      {
        type: "p",
        text: "Docs don't work; a REST API needs a server, a login, discovery. MCP is what agents already speak — the session writing the code can just ask. The cost: it's new, and mine runs locally.",
      },
      { type: "h3", text: "Components: Web Components over React" },
      {
        type: "p",
        text: "Lit is clunkier inside React — the real cost. But one version works everywhere instead of three synchronized buttons. One source beats the smoother React-only version.",
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
          "Two-layer token architecture across four brands",
          "27 Lit web components; Code Connect mappings authored and build-gated, publishing gated on plan tier",
          "MCP server with 17 tools: contracts, tokens, rules, contrast, consumer linting",
          "One rule set behind every checker — the gates can't disagree",
          "CI on every change: schema, lint, reference resolution, staleness, golden-CSS, tests",
          "Tokens ship as an npm package with agent context packs inside — this site consumes it",
          "Per-prop code↔Figma bindings, plus a parity differ that classifies drift",
          "Weekly automated audits: consumer drift + code↔Figma parity, filing issues on drift",
          "Anatomy contracts on the three deepest components; batch rollout underway",
          "The governance eval harness behind the 95/70 number",
          "WCAG AA verified across every intended pairing, in every brand",
        ],
      },
      { type: "h3", text: "Deliberately deferred" },
      {
        type: "ul",
        items: [
          "Publishing the component library and MCP server to npm (the token package ships today)",
          "Migrating the remaining sites (.art, .blog) onto the package",
          "Auto-fixing drift: the scan detects and files issues today; opening a fix PR is next",
          "Generating Figma and component code from the contract — the committed end state",
        ],
      },
      { type: "h3", text: "Scored against an external yardstick" },
      {
        type: "p",
        text: "Self-assessment is cheap, so the system is also graded against Brad Frost's ten-station design-system inspection. First pass: 71. Three re-inspections closed the gaps.",
      },
      {
        type: "stats",
        items: [
          { value: "76/80", label: "Across the 8 stations scored so far" },
          { value: "3", label: "Perfect stations: accessibility, machine-readable docs, agent access" },
          { value: "9/10", label: "Every remaining scored station" },
        ],
      },
      {
        type: "p",
        text: "Still open: one borderline 4.38:1 pairing, and the two process stations unscored until they've run long enough to judge — re-score in October.",
      },
      { type: "hr" },
      { type: "h2", text: "Reflection" },
      {
        type: "p",
        text: "Every system I'd built before made things clear to people. This one asks what a system looks like when its main reader is a machine. The answer is **structure**: tokens as data, components that carry their own rules, a system an agent can query.",
      },
      {
        type: "p",
        text: "A component library tells you what exists. This one also tells an agent what it's allowed to use.",
      },
    ],
  },
};
