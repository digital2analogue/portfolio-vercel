# Image Migration Shortlist

Images to migrate from `portfolio-site/static/projects/images/` into `portfolio-vercel/public/projects/images/`.

## Already in portfolio-vercel (no action needed)

| File | Case Study | Role |
|------|-----------|------|
| `01_hero_dark.png` (144KB) | C1 Decision Engine | Hero — polished dark-theme rules table, 8 rows |
| `04_component_system_dark.png` (62KB) | C1 Decision Engine | Component system — badges, operators, row states |
| `ot-design-system-hero.png` (179KB) | OTKit | Hero — color palette, tokens, component library overview |
| `ot-design-system-detail.png` (200KB) | OTKit | Detail — three-tier token architecture diagram |
| `ot-reservations-hero.png` (199KB) | Reservations | Hero — redesigned reservation details, card-based layout |
| `ot-reservations-detail.png` (222KB) | Reservations | Detail — before/after comparison side-by-side |

Also present but unused in caseContent: `02_hero_c1_brand.png`, `03_hero_light.png`, `05_component_system_light.png`, `06_hero_raw.png`, `07_component_system_raw.png`

---

## 1. Capital One Decision Engine

Hero is covered by `01_hero_dark.png`. Migrate these 4 supporting images:

### Recommended

| # | File | Size | Role | Why |
|---|------|------|------|-----|
| 1 | `c1-decision-engine-before-after.png` | 67KB | **Before/After** | The single strongest storytelling image for this case study. Shows the messy spreadsheet ("Policy Rules v14 FINAL.xlsx" with `???` and `confirm w/ Lisa`) next to the structured rules table. Instantly communicates the transformation. |
| 2 | `c1-decision-engine-onboarding-flow.png` | 67KB | **UX Flow** | Three-step onboarding wizard (Choose outcome → Name model → Select data elements). Shows end-to-end UX thinking beyond just the table view. Clean horizontal layout reads well at any width. |
| 3 | `c1-decision-engine-rule-row-anatomy.png` | 20KB | **Component Anatomy** | Annotated breakdown of a single rule row — drag handle, rule name, data attribute badge, operator, value, outcome badge. Demonstrates design-systems rigor. Tiny file size. |
| 4 | `c1-decision-engine-data-element-selector.png` | 77KB | **Deep Dive** | Step 3 split-panel showing 41 available data attributes with metadata preview. Demonstrates complexity management — the kind of detail that shows you actually designed the hard parts. |

**Story arc:** Hero (outcome) → Before/After (problem) → Onboarding (flow) → Anatomy (system) → Selector (depth)

**Optimization notes:** All files are well under 100KB. No action needed.

---

## 2. OTKit / OpenTable Design System

Hero + token architecture are covered. Migrate these 5 supporting images:

### Recommended

| # | File | Size | Role | Why |
|---|------|------|------|-----|
| 1 | `cs-legacy-sot.png` | 373KB | **Problem State** | Screenshots of three competing sources of truth (Storybook, Design Bar token site, Figma). Viscerally shows the drift problem before consolidation. Essential for the "before" half of the story. |
| 2 | `casestudy-otkit-colormappingtool.png` | 530KB | **Color Migration Tool** | The color mapping documentation showing how teams migrate from old to semantic tokens across light/dark and platform themes. Shows you built tooling, not just specs. |
| 3 | `casestudy-otkit-diner-ab-test.png` | 1.1MB | **Typography in Context** | Type scale mapped to the actual Diner app — left side shows the scale, right side shows it applied with "Dynamic" and "Custom (fixed)" annotations. Ties system decisions to real product outcomes (+2.19% bookings). |
| 4 | `casestudy-otkit-icon-library.png` | 173KB | **Icon Library** | Clean grid of the searchable icon library — ~80+ restaurant-domain icons (Catering, Champagne Glasses, Chef, Cocktail, etc.). Visually rich, shows the breadth of the system. |
| 5 | `casestudy-otkit-newsletter.png` | 583KB | **Governance** | The "OTKit Variables are now in Figma" newsletter with step-by-step onboarding and embedded video demo. Shows the human side of systems work — communication, change management, adoption. |

**Story arc:** Hero (system overview) → Legacy SOT (problem) → Color tool (foundations) → Typography (impact) → Icons (breadth) → Newsletter (governance)

### Honorable mentions (consider for expanded version)

| File | Size | Notes |
|------|------|-------|
| `casestudy-otkit-dynamic-text.gif` | 1.7MB | Animated iOS dynamic text sizing. Great demo but 1.7MB GIF — convert to video/WebM if used. |
| `casestudy-otkit-opentable-new-brand-app.gif` | 5.0MB | Brand refresh on iPhone. Beautiful but **5MB GIF — must convert to video**. |
| `casestudy-otkit-ambassadorship.png` | 18KB | Ambassador program diagram. Conceptually strong but visually sparse (black silhouettes, no polish). |
| `cs-interface-opacity.png` | 736KB | Annotated screenshot of inaccessible opacity-based components. Good problem evidence but visually cluttered. |
| `casestudy-otkit-typescale.png` | 389KB | Clean type scale table (Mobile/Tablet/Desktop). Useful reference but less visually exciting than the contextual version. |
| `icon_grid_animated.gif` | 206KB | Animated icon keyshape grid. Small file, nice touch — good if you want to show icon construction process. |

### Flagged for optimization

| File | Size | Issue | Recommendation |
|------|------|-------|----------------|
| `casestudy-otkit-opentable-icons-debby-linkedin.gif` | **23MB** | Way too large for web. LinkedIn screen recording as GIF. | **Do not migrate as-is.** Convert to MP4/WebM (should compress to ~2-3MB) or skip entirely. |
| `casestudy-otkit-opentable-new-brand-app.gif` | **5.0MB** | iPhone brand animation GIF. | Convert to MP4/WebM before migrating. |
| `casestudy-otkit-color2.png` | **3.1MB** | Oversized PNG. | Not recommended for migration, but optimize if ever needed. |
| `casestudy-otkit-splash.png` | **1.9MB** | Dense collage of work artifacts. | Interesting as a "process wall" image but too large and visually busy for web. |
| `casestudy-otkit-diner-ab-test.png` | **1.1MB** | Recommended above. | Consider running through ImageOptim or converting to WebP (~300-400KB). |

---

## 3. OpenTable Reservation Redesign

Hero + before/after detail are covered. Migrate these 5 supporting images:

### Recommended

| # | File | Size | Role | Why |
|---|------|------|------|-----|
| 1 | `ot-reservations-legacy-detail.png` | 200KB | **Legacy "Before"** | iPad screenshot of the old reservation detail — dark sidebar, flat text-dump layout, visible density problems. Pairs perfectly with the redesigned hero to show transformation. |
| 2 | `cs-rest-modular-design.gif` | 900KB | **Modular Breakdown** | Animated breakdown showing how the reservation view decomposes into discrete card-based system patterns. The key conceptual image for the "how" of the redesign. |
| 3 | `ot-reservations-ios-ipad-after.png` | 438KB | **iPad After** | The redesigned iPad experience — dark chrome, structured guest info, tags, notes, food preferences. Direct counterpart to the legacy screenshot. Beautiful. |
| 4 | `ot-reservations-guest-profile-boh.png` | 551KB | **Guest Profile Component** | Desktop "Back of House" view showing the new Guest Profile component alongside a reviews panel. Shows the system scaling to web, not just native. |
| 5 | `ot-reservations-inline-theming.png` | 1.1MB | **System Alignment** | Documentation showing inline theming (mixed light/dark mode) with annotated UI zones plus semantic token examples (success/warning states). Bridges the reservations work back to OTKit. |

**Story arc:** Hero (outcome) → Legacy detail (problem) → Modular design (strategy) → iPad after (platform) → Guest profile (component) → Inline theming (system)

### Honorable mentions

| File | Size | Notes |
|------|------|-------|
| `ot-reservations-color-tokens-native.png` | 813KB | Xcode showing OTKit color tokens in iOS project. Very technical — great for engineering-audience version. |
| `ot-reservations-ios-modular-layout.gif` | 598KB | iOS phone animation of modular layout. Good but overlaps with `cs-rest-modular-design.gif`. Pick one. |
| `ot-reservations-guest-profile-boh-detail.png` | 379KB | Close-up of guest profile with action menu overlay. Nice detail shot but similar story to the wider BOH view. |
| `cs-rest-1.png` | 852KB | Zoom team photo. Adds human element but low resolution and not directly about the work. |
| `ot-reservations-before-after.gif` | 900KB | Animated before/after. Redundant with `ot-reservations-detail.png` already in Vercel. |

### Flagged for optimization

| File | Size | Issue | Recommendation |
|------|------|-------|----------------|
| `ot-reservations-inline-theming.png` | **1.1MB** | Tall composite image (docs + UI + tokens). | Run through ImageOptim or convert to WebP (~400KB). |
| `ot-reservations-color-tokens-native.png` | **813KB** | Dark Xcode screenshot, mostly text. | Would compress well to WebP if used. |

---

## Summary: Files to Copy

```
# Capital One (4 files, ~231KB total)
c1-decision-engine-before-after.png
c1-decision-engine-onboarding-flow.png
c1-decision-engine-rule-row-anatomy.png
c1-decision-engine-data-element-selector.png

# OTKit (5 files, ~2.7MB total — optimize diner-ab-test)
cs-legacy-sot.png
casestudy-otkit-colormappingtool.png
casestudy-otkit-diner-ab-test.png          # ⚠️ 1.1MB, optimize
casestudy-otkit-icon-library.png
casestudy-otkit-newsletter.png

# Reservations (5 files, ~3.1MB total — optimize inline-theming)
ot-reservations-legacy-detail.png
cs-rest-modular-design.gif
ot-reservations-ios-ipad-after.png
ot-reservations-guest-profile-boh.png
ot-reservations-inline-theming.png         # ⚠️ 1.1MB, optimize
```

**Total: 14 files, ~6MB before optimization.**
After optimizing the two flagged PNGs → WebP, expect ~4.5MB total.

---

## 4. Hash-Named Images Added (April 2026)

Visual review of all 28 hash-named files from the Hugo repo. Only 1 was a duplicate of an existing file (`0kkrfA9yT5p4WDpP.png` = `ot-reservations-legacy-detail.png`). The remaining 27 were reviewed visually and the best 7 were selected for strongest visual storytelling.

### Selected (7 files, ~5.0MB total)

| # | File | Size | Case Study | Shows | Why Selected |
|---|------|------|-----------|-------|--------------|
| 1 | `4BJdfF7HVOomxBNk.png` | 889KB | OTKit | **Remote brainstorming exercise** — FigJam "Problem & Solution Exercise" with sticky notes identifying core design system problems (inconsistent source of truth, lack of platform-agnostic components) | Real team collaboration artifact. Shows the research/discovery process that led to OTKit. Fills a gap — no existing image covers the early problem-framing phase. |
| 2 | `seRolVT4cf8Azwnr.png` | 944KB | OTKit | **Dovetail research consolidation** — Survey responses with tagged themes (booking panels, reservation cards, modals, lack of documentation) and synthesized insights | Shows rigorous UX research methodology with real tagged data. Pairs with the brainstorming image to tell a complete research story. |
| 3 | `3UxjijGLRDUlHaXt.png` | 376KB | OTKit | **Foreground color tokens in Figma** — Dark-mode variables table showing semantic tokens (default, alt, disabled, action, success, warning, danger) across light/dark themes | More polished and specific than existing token documentation images. Shows the actual Figma variables implementation visitors can study. |
| 4 | `KMBOqHcuZ13ZJHVc.png` | 487KB | Reservations | **Typography before/after** — Side-by-side iPad screens comparing Legacy (Source Sans Pro) to OTKit update (SF Pro Text) on the same reservation flow | Concrete before/after on a real screen. Shows how system-level typography changes manifest in product. Bridges OTKit → Reservations story. |
| 5 | `rdrOtqLhwSzBHOSg.png` | 342KB | Reservations | **Guest profile touchpoints** — Product strategy slide showing guest profiles surfaced across multiple contexts (popup card + desktop reviews panel) with "Increase guest profile touchpoints" headline | Shows product thinking beyond just UI — where and how the component scales across the product. Good storytelling about design system impact. |
| 6 | `LYdeXrdYfQB7IY5o.png` | 1.7MB | Reservations | **Brand concept explorations** — "Blur" (dark, immersive) vs "Minimal" (light, clean) concepts for the OpenTable Diner app, with polished iPhone mockups | Beautiful design exploration showing the range of creative thinking. Demonstrates the exploratory phase before converging on a direction. ⚠️ Large — consider WebP optimization. |
| 7 | `0W9krCIIVX88uUQN.png` | 281KB | OTKit | **Design system KPIs** — Framework measuring system health across Consistency, Efficiency, Engagement, and Usability with specific measurable indicators | Shows strategic thinking — measuring design system impact, not just building it. Unique among all images; no other image covers governance metrics. |

**Story arcs these fill:**

- **OTKit research phase:** Brainstorming (#1) → Research synthesis (#2) → KPIs (#7) — visitors can now see the problem discovery, validation, and measurement approach
- **OTKit foundations depth:** Figma color variables (#3) adds a "zoom in" moment to the token architecture
- **Reservations craft:** Typography before/after (#4) + guest profile touchpoints (#5) + brand exploration (#6) show both systematic rigor and creative range

### Not selected (20 files) — rationale

| File | Shows | Why Skipped |
|------|-------|-------------|
| `0kkrfA9yT5p4WDpP.png` | Legacy reservation detail | **Duplicate** of `ot-reservations-legacy-detail.png` already in portfolio-vercel |
| `322gpckD95pralbr.png` | Guest profile component (name, tags, notes) | Similar content already covered by `ot-reservations-guest-profile-boh.png` — different crop but same story |
| `BVe4JpWvjzClhvky.png` | OTKit design system maturity model (4 stages) | Conceptual/process diagram, not product work. Interesting but visually generic compared to actual UI screenshots |
| `D3vRvXwFb9yibOPw.png` | 360 Guest Profile marketing slide | Marketing collateral, not design artifact. The actual guest profile UI images tell a better story |
| `EUlbmk9MC51da8x1.png` | Legacy vs OTKit passcode screen (before/after on green bg) | Nice before/after but very narrow scope (single numpad screen). The typography before/after (#4) covers the same idea with more context |
| `JcAntkQsvC6bZ4qF.png` | Xcode color tokens in iOS project | Very technical (Xcode file tree). Covered better by the Figma variables image (#3) which is more accessible |
| `LpJKN8PD7BZVd2Om.png` | Slack message: "Reservation Card Redesign... dark mode fo freeeee" | Fun social proof but low-res Slack screenshot. Not portfolio-grade |
| `Mni3ATlWVZx2A9kq.png` | Icons Library with search (Action/Fill/Navigation categories) | Similar to `casestudy-otkit-icon-library.png` already present — different view but redundant |
| `QP1X9WUkWvSWv8v2.png` | OpenTable Diner app home screen (dark, restaurant cards) | Product screenshot but doesn't demonstrate design system work specifically |
| `T306LeV5Zqshd7gp.png` | iPad reservation detail (no device frame) | Same view as `ot-reservations-ios-ipad-after.png` already present, just without the device chrome |
| `Xvur54KkWJUnDXP9.png` | Mobile + Desktop type scale tables | Clean reference but visually dense/dry. The contextual typography before/after (#4) tells the story better |
| `bVcyX8h5ylTinpKt.png` | iPhone guest profile edit screen (dining preferences, dates) | Single screen, narrow scope. Guest profile story better served by existing BOH image + touchpoints slide (#5) |
| `bs0X2BdJ4q8BvhqF.png` | Brand refresh exploration collage (5 proposals + mood boards) | 2.3MB dense collage — too visually busy and too large. The cleaner concept comparison (#6) covers this better |
| `eazhugtORp5kUfXg.png` | Typography exploration slides (serif/sans specimens + Figma tokens) | Process artifact showing font evaluation. Interesting but visually cluttered. Type before/after (#4) is more impactful |
| `gHPwGQnCaABT30ir.png` | Magazine-style type specimen ("Find your next restaurant obsession") | Beautiful but more about editorial design than design system work |
| `h3W3OsdrmFFLglbK.png` | Diner app reviews tab (dark mode, star ratings) | Product screenshot but doesn't specifically demonstrate design system contribution |
| `lFgN9YPg7XvqTGMY.gif` | Passcode numpad animation (light mode, single frame capture) | GIF showing interaction — similar to `4c7CzTAV63oL8JvJ.gif`. Both too narrow in scope |
| `4c7CzTAV63oL8JvJ.gif` | Passcode numpad animation (legacy version) | See above |
| `lkkcJcmNzfVjMuc2.png` | OTKit timeline/roadmap (5-month plan) | Process/planning artifact. Useful internally but doesn't showcase design craft |
| `zA2LVZsiAvcqgwKf.png` | Diner Experiences tab (dark mode, event listings) | Product screenshot but doesn't demonstrate design system work specifically |
