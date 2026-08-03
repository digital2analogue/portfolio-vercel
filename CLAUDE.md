# CLAUDE.md

This file provides guidance when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server (Next.js 16, http://localhost:3000)
npm run build          # contrast check → next build (contrast gate blocks on failure)
npm run lint           # ESLint CLI (flat config in eslint.config.mjs; next lint was removed in Next 16)
npm run test           # Vitest unit tests (tests/unit)
npm run test:visual    # Playwright visual regression (tests/visual, committed linux baselines)
npm run test:visual:update # Regenerate baselines after intentional visual changes
npm run check-contrast # Run WCAG AA check in isolation
npm run sync-tokens    # Check installed @digital2analogue2/parsimony version against the latest published
npm run render-diagrams # Rasterize public/projects/images/ds-*.svg → 2× PNG (headless chromium; see Case-Study Diagrams)
```

## Architecture

**Next.js 16 App Router** portfolio site with Tailwind CSS v4 and TypeScript. Vitest covers unit tests (`tests/unit`), Playwright covers visual regression (`tests/visual`); both run in CI (`.github/workflows/ci.yml`) and the pre-commit hook runs lint-staged + unit tests + the contrast gate. Test infra is excluded from `next build`'s type-check via tsconfig `exclude` — keep it that way so test configs can never break a Vercel deploy.

**Visual baselines are generated ON the CI runner, never locally** — font rasterization differs across machines, so locally-generated baselines fail in CI. After an intentional visual change, run the "Update visual baselines" workflow from the Actions tab (it regenerates and commits them on the runner). **Workflow quirk:** the workflow's `github-actions[bot]` commit does NOT trigger CI (it lands as `action_required`) — after the regen commit appears, push an empty `ci: re-trigger checks on regenerated baselines` commit to get `checks`/`visual` to run. `main` has branch protection requiring the `checks` and `visual` status checks; Dependabot files weekly grouped bumps and the `dependabot-automerge` workflow merges them once CI passes (major npm bumps stay manual). Baselines capture at 1280px desktop under reduced motion — mobile-only CSS (≤700px media queries) and reduced-motion-suppressed animation never shift them.

**Known Dependabot gotcha (2026-07-20):** a grouped `npm-dependencies` bump can quietly fold in a major the Next 16 ecosystem isn't ready for yet, even though most of the group is safe. Two hit at once in PR #40: `typescript ^7` (the native Go-compiler distribution — Next 16's built-in TS integration can't load it, so `next build` fails with *"trying to use TypeScript but do not have the required package(s) installed"*, which is what actually shows up as the **Vercel deploy failure**) and `eslint ^10` (drops `context.getFilename()`, which the `eslint-plugin-react` bundled by `eslint-config-next@16` still calls, so `npm run lint` throws — this only surfaces in CI's `checks` job, never in the Vercel build, since Next 16 doesn't lint at build time). Fix pattern: don't close the whole group — branch off it, pin just the incompatible major(s) back to their current version, keep everything else, and verify locally with the full CI-equivalent sequence (`lint` + `test` + `build`, not just `build`) before opening the replacement PR. See #41.

### Design Token System

This repo consumes tokens from the **brand-tokens** design system as the published npm package **`@digital2analogue2/parsimony`**. `app/globals.css` imports the base dark-theme CSS (`@digital2analogue2/parsimony/base.css`) — it is no longer hand-copied. The token *values* are never edited here; change them in brand-tokens, publish a new package version, and `npm install` it.

#### Source of truth hierarchy

```
brand-tokens/tokens/base/              ← edit token values here first
  ↓ build (node scripts/build-brands.mjs in brand-tokens)
brand-tokens/packages/tokens           ← published as @digital2analogue2/parsimony
  ↓ npm install
node_modules/@digital2analogue2/parsimony/css/variables.css
  ↓ @import "@digital2analogue2/parsimony/base.css"
app/globals.css                        ← imports base + a thin override layer
```

`npm run sync-tokens` checks the installed package version against the latest published, so this consumer can't silently fall behind the source of truth.

#### Token layers in globals.css

1. **Imported base** — `@import "@digital2analogue2/parsimony/base.css"` provides all primitives, semantic roles, and typography shorthands (fixed base values).
2. **Portfolio override `:root`** — re-declares ONLY the deltas on top of the package: responsive `clamp()` scaling for the larger spacing/type steps, and font-family tokens that defer to the next/font variables. Cascades through because semantic/shorthand tokens reference primitives via `var()`.
3. **Portfolio-specific** — layout widths, phosphor bloom not yet in brand-tokens.
4. **Tailwind bridge** — `@theme inline` block re-exposes semantic tokens as Tailwind utilities.

To change a token value, edit brand-tokens → publish → `npm install @digital2analogue2/parsimony@latest`. For a portfolio-only override, add it to the override `:root` in `globals.css`.

### Contrast Gate

`scripts/check-contrast.mjs` runs before every build. It validates colour pairings against **both** WCAG AA criteria: 1.4.3 (text, 4.5:1) and 1.4.11 (non-text — a control's fill, boundary or state indicator, 3:1). Pass `min: NON_TEXT` on a pairing for the latter; text is the default. The 1.4.11 half was added after three controls in the reservation-detail demo measured 1.1–1.5:1 and were invisible to low vision while every text label passed.

**When you add a new color pairing to the UI, add it to the `PAIRINGS` array in `scripts/check-contrast.mjs`.** The build will not catch it otherwise.

**Gate scope / known gaps.** The gate only checks *static token pairings* — it does not see rendered state. Two classes of contrast issue slip past it and have been surfaced by external audits (Vercel/axe/Lighthouse):

- **Animation transients.** The `.rise` entrance animation fades `opacity: 0→1` with staggered delays (up to ~1520ms). Mid-fade, low-contrast text (muted/alt foregrounds, e.g. section eyebrows) drops below 4.5:1, and audits snapshot the page mid-flight. This is a **known, intentionally-accepted** violation — the fade-in look is a deliberate design choice (a transform-only fix was tried and rejected). Don't "fix" it without checking first.
- **Decorative text nodes.** The `.dot-rule` section dividers were bullet glyphs (`·`) at border color (1.23:1) — decorative and `aria-hidden`, but still flagged as text. They are now drawn as a CSS `radial-gradient` background (no text node), so no contrast rule applies. Keep decorative "text" as CSS backgrounds, not glyphs.

To reproduce what the portal sees, run an axe scan against the built site (`@axe-core/playwright` over all routes) — the build-time gate alone is not sufficient.

### JS Token Re-exports

`lib/tokens.ts` exports a `T` object and font variables (`mono`, `sans`) that reference CSS vars. Components use inline styles with `T` as the primary styling pattern: `color: T.accent`, `fontFamily: mono`.

### Key Data Files

- `lib/cases.ts` — Case study data (typed as `CaseStudy[]`)
- `lib/tokenValues.ts` — Build-time token resolver for the `/tokens` viewer page: reads the installed `@digital2analogue2/parsimony` CSS via `node:fs`, resolves `var()` chains, and exposes `catalog(prefix)` / `tokenValue(name)` / `tokenVersion` / `semanticCount`. Server-only (never import from a client component). The page therefore self-updates on every package bump — there is no hand-maintained catalog (the old `lib/tokenCatalog.ts` is gone). A missing/renamed upstream token fails the build loudly by design.
- `lib/caseContent.ts` — Case-study body content (`CASE_CONTENT`, a closed typed `Block` union; see Interactive Case Demos below). The Parsimony case study is keyed `"system"` (route `/work/system`).

### Case-Study Diagrams (`public/projects/images/ds-*.svg`)

The Parsimony (`/work/system`) case-study diagrams are **hand-authored SVGs**. The case page now embeds the **SVG source directly**: `diagram` blocks in `lib/caseContent.ts` point at the `.svg`, `lib/diagrams.ts` inlines the markup server-side, and `components/DiagramBlock.tsx` animates it on scroll-in (cards fade up in authored order, stroked connectors draw on; authored `stroke-dasharray` — the amber "planned" style — is preserved and fades instead; reduced-motion renders the finished diagram immediately). The 2× PNGs from `npm run render-diagrams` (`scripts/render-diagrams.mjs`, headless chromium — mirrors `generate-og.mjs`; uses the bundled browser at `/opt/pw-browsers/chromium`, never `playwright install`) remain the declared fallback and stay committed — edit the `.svg`, re-run `render-diagrams`, commit both. House style: `#0A0D0A` canvas, `#4ADE6E` phosphor accent, Space Grotesk titles / JetBrains Mono labels, green = shipped / amber-dashed = planned. **No duplicate titles (2026-07-21 review rule):** a diagram must not carry an in-graphic title/subtitle that repeats the section heading or figure caption above it — five diagrams had theirs stripped and top band cropped; `ds-token-tiers` ("Two tiers, one value") and `ds-architecture` ("Parsimony" + legend) keep theirs deliberately because they add info no heading has. `/work/system` is not visual-regression snapshotted, so diagram edits need no baseline regen.

**Code/docs gap — RESOLVED (2026-07-27):** the case study + diagrams present Parsimony's token model as **two-tier, semantic-only** (primitives → semantic). From 2026-07-14 to 2026-07-27 this deliberately *led* the code; **parsimony#114 has since landed** (component tier deleted, `@digital2analogue2/parsimony@0.6.0`), so the case study now simply matches reality. Keep the two-tier framing. (History in `parsimony/docs/decisions.md`, 2026-07-14 and 2026-07-27 entries.)

**Diagrams carry live upstream counts (2026-07-29, PR #56):** `ds-architecture`'s component band states the parsimony census as literal text — **27 Lit web components · meta.json contract 27/27 · Figma Code Connect 22/27** — and its amber rail reads *drift + parity audits → auto-fix PR* (detection shipped, auto-fix planned); `ds-meta-json` shows an `anatomy` block in the contract excerpt. These figures go stale when parsimony's component count, Code Connect coverage, or contract shape changes — verify against the parsimony repo and re-edit the SVGs + re-run `render-diagrams` when touching this surface.

### Interactive Case Demos (in-page live components)

Case bodies render a **closed, typed block union** (`Block` in `lib/caseContent.ts`) via `components/CaseBlocks.tsx` — data, not MDX/JSX. Three block variants embed live/interactive content:

- `demo` — a registry-keyed React component. Add a component to `components/demos/`, register it in `components/demos/registry.ts` under a `DemoKey`, then reference it as `{ type: "demo", demo: "<key>", frameLabel?, caption?, surface? }`. `CaseBlocks` wraps it in the `.demo-frame` chrome; `surface: "dark"` renders on the dark system canvas instead of the OTKit light surface. Three demos exist: `reservation-status` (OTKit status dropdown, WAI-ARIA listbox, grouped Pre-dining / During service; data in `lib/reservationStates.ts`) and `table-status` (floor-plan tile contrast audit; data in `lib/tableStatus.ts`), both on `/work/ot-design-system`; and `check-usage` (live lint playground on `/work/system`, dark surface, labeled a Playground in its frame + toolbar — rules ported from parsimony in `lib/checkUsageRules.ts`, unit-tested in `tests/unit/checkUsageRules.spec.ts`; keep it in sync with parsimony's `scripts/rules.mjs` if those detectors change). `reservation-detail` + `reservation-detail-editorial` are the redesigned iOS reservation-detail screen, live on `/work/ot-reservations` where the `ot-reservations-ios-modular-layout.gif` used to be (data in `lib/reservationDetail.ts`, glyphs in `components/demos/reservationDetailIcons.ts`, scroll-spy + tag categories unit-tested). **They are ONE component with a `variant` prop, not two** — the editorial treatment is a single CSS layer (`.rd--editorial`), so a fix to the base is a fix to both; never fork it. `reservation-detail-ipad` is the Back-of-House tablet composition of the *same* record (`ReservationDetailIPad.tsx`, shell data in `IPAD`). Both gifs still ship as documented sources but neither is rendered.

Traps these three document:
- The sticky note strip reads section `offsetTop`, so its scroller (`.rd-scroll`, `.rdp-notes`) must stay `position: relative` or every tab jump clamps to max scroll.
- **Never wrap the sticky strip.** `position: sticky` sticks within its *parent*, so an `.rd-zone` wrapper added for the entrance cascade silently gave it a zero-height stick range and it never pinned. `SelectStrip` takes `className`/`style` for exactly this — put the zone class on the strip itself.
- Behaviour is shared, not copied: `useSectionSpy` (spy + jump + roving keys) and `useEntrance` are exported from `ReservationDetailDemo` and used by both shells. A second hand-rolled copy is how the two selection strips drifted apart the first time. The entrance cascade keys off `[data-entered]` on **both** `.rd-screen` and `.rdp-screen` — it silently did nothing on the tablet for several rounds because the selector only named the phone's.
- Elevation is one recipe in two directions (`--rd-edge-down` / `--rd-edge-up`), used by every "content passes under this edge" shadow on both shells. The sticky strip and the tablet dock had separately-invented values; that is how an interface ends up with three shadow languages and nobody able to say what any of them means.
- `.blocks` styles bare `h3/h4/p/ul`, so each demo heading carries `rd-reset` + a `.rr-demo.rd`-scoped rule rather than a type-selector reset (a `.rd h3 {}` reset would outrank the very classes it's protecting).
- Every `:hover` is behind `(hover: hover) and (pointer: fine)` — on touch, hover latches after a tap and leaves rows stuck tinted; on a *selection* control that reads as a second selection.
- Glyphs are 24px (primary affordances) or 16px (secondary/inline) with nothing in between. The editorial variant keeps the category glyph on section labels — it is the only channel shared with the tag chips and the strip, and dropping it left the screen naming categories in one place and drawing them in another.
- **iPad specifics.** The shell is modelled on the redesigned iPad BOH screen (`public/projects/images/otreservationsnativeiosandroid.png` is the authoritative comp; OTKit's legacy Figma is `lk1Xd5BlZ44ITvJEr0J9bd`, node `3955:4087`). Its dark values are OTKit's **own dark-mode tokens**, not sampled: `background/default #141A26`, `background/elevation #2D333F`, `border/default #6F737B`, `ash-lighter #D8D9DB`. An earlier pass eyedropped them from a clip and produced a chrome that was plausible and wrong — **pull the tokens, don't sample the pixels** — and a second pass then deleted the left icon rail on the strength of the *legacy* frame, which the redesign still has. Check the comp before removing structure. Composition: rail 40 · service lists 232 · record 374 · actions 192. The rail carries a footer (settings, about) and the list panel a dock (sign-out set apart, then five tools) — both exist in the redesign; a crop that cut them off is what briefly deleted them. `.rdp-device` has `min-width: 848px` so the shell fits the 854px case column exactly at desktop. Date/shift/nav controls are **outlined, not filled**.
  - **Where the status lives depends on whether the party is seated.** Unseated: the status is the **leading** marker on the far left (colour-blocked only when it is an attention state), and the trailing button is about the TABLE — outlined, neutral glyph, table number above it when assigned. Seated: the status moves **into the trailing button**, which fills with the status colour. Driven off the state's `phase` in `lib/reservationStates.ts`, resolved via `stateById()` — the same 22-state taxonomy the status-dropdown demo on `/work/ot-design-system` edits, so the two can't drift. Never tint both ends: the same signal in two places makes the colour column stop meaning anything.
- The section collapse caret and the row's trailing button share a right-hand column, so they are **one shape at one size** (`--rdp-btn-w`/`--rdp-btn-h`). Verify by measuring, not by eye. Attribute marks start on the reservation TIME's line and wrap downward, bounded to four cells — centred, they float between the name and the button at whatever height the mark count produces.
  - `--rdp-focus` is the legacy primary blue (8:1 on the panel); OTKit's action teal is only 3.82:1 there — legal for a non-text indicator but muddy. The selected reservation carries an accent bar as well as its fill: the fill alone is 1.31:1 against the panel beside it, which SC 1.4.11 covers as a *state indicator*. All eleven status tones clear 3:1 as glyphs on the panel (accent-teal is the floor at 3.24:1).
  - **The nav rail and dock are a STROKED glyph set** — the whole left column is one light outline weight in the comp, with no filled mark in it. That is why `DemoIcon` has a `stroke` flag: the file's "everything is filled" rule is about filled and outlined glyphs sharing a *row*, and a whole surface in one weight is a treatment, not a mixture. Rail glyphs live only in the rail; the filled OTKit `seat` stays authoritative everywhere else on the screen.
- **Phone (≤700px):** the shell does not collapse — it rests as a scaled, inert teaser behind a "Tap to view prototype" CTA (the same bargain `.block-embed__mobile` makes) and opens to a fixed full-screen stage where it pans at true size. The teaser's scale and its stage height are **measured** in a `ResizeObserver`, because no CSS unit turns a container width into a unitless `scale()` factor. `.rr-demo` carries a 470px `min-height` at that width which `.rdp` must override, or the CTA floats in 240px of dead scrim. The opened stage is an opaque lightbox (translucent, the page bleeds through and it reads as a fault), scrolls to the RECORD rather than opening on two columns of chrome, and carries edge fades plus a swipe hint — the shell is 848px against a ~390px phone and nothing else says so.
- `embed` — a lazy 16/10 iframe of a deployed prototype (e.g. decisioning-table on `/work/c1-decision-engine`), rendered by `CaseEmbed`.
- `outcome-demo` — the standalone decision-engine outcome-toggle device card (`OutcomeToggleDemo`).

Conventions:
- Demos are **faithful OTKit light-mode** surfaces framed inside the dark site. Their palette is **demo-local** — scoped classes (`.demo-frame`, `.rr-demo`, `.rr-status*`, `.rr-tiles*` in `globals.css`) with OTKit hex values that must NOT leak into the dark Parsimony system. Register every demo text/bg pairing in `scripts/check-contrast.mjs` PAIRINGS as resolved hex.
- Icons are the **real OTKit vectors** inlined in `components/demos/otkitIcons.ts` (`fill=currentColor`), generated from the exported icon library — no CDN/egress dependency.
- **Visual-regression note:** `tests/visual/pages.spec.ts` only snapshots `/`, `/work`, `/about`, `/contact`, `/tokens`, and `/work/c1-decision-engine`. The OTKit demo routes (`/work/ot-design-system`, `/work/ot-reservations`) are NOT snapshotted, so **demo-only changes need no baseline regen** (the "Update visual baselines" workflow is irrelevant to them).
- Dev gotcha: a stale `next-server` on port 3000 from an earlier run will silently serve the OLD build (`npm run start` fails to bind and you verify nothing). If a rebuild "didn't take," `kill` the PID holding 3000 (find via `ps aux | grep next-server`) and restart.

### Live Motion Surfaces (home hero + /tokens)

- **`components/HeroTerminal.tsx`** — the home hero really types its `whoami` boot sequence on load. Caret shows **only while typing** (review rule: the nav brand's cursor is the page's only resting blink). Under `prefers-reduced-motion` it renders the full text with no caret — pixel-identical to the old static hero, which is what keeps the `/` visual baseline stable.
- **`components/TokensMotion.tsx`** — the /tokens Motion section drives real motion from the resolved token values: per-row tracks with a **▶ Play button under each** (review rule: no single global play), SVG bezier curve plots, a one-time scroll-in race. Dots rest at start → dart at true token duration → hold ~1.1s → snap home (without the reset, short durations read as "nothing happened"). **Motion policy:** an explicit ▶ press plays even under `prefers-reduced-motion` (deliberate user-initiated motion is the accepted exception); ambient playback (scroll-in, hover replay) stays gated. Rows stack at ≤700px — the base `.tokens-row__value` is `nowrap` and will collide with the anim column otherwise.
- **`lib/firstSentence.ts`** — every token description on /tokens clamps to its first sentence at render time (review rule: the reference page shows the role line only). The full multi-sentence guidance lives upstream in Parsimony for agents — don't shorten it there, and don't un-clamp here.

### Case-body typography (review-settled 2026-07-21)

`.blocks h3` is `--font-title-small` (h2 stays `--font-title-medium`) so nested sub-headings visibly step down; figcaptions are **regular (non-italic) `--font-label-small`** via the single shared `.blocks figure figcaption` rule. Both were review decisions — don't revert to same-size h3s or italic label-medium captions.

### Routes

- `/` — Home with typewriter hero animation
- `/work` — Case studies
- `/about` — About page
- `/contact` — Contact page
- `/tokens` — Design token reference/viewer

### Fonts

Space Grotesk (sans/titles), Spectral (serif/body), JetBrains Mono (code) loaded via `next/font/google` in `app/layout.tsx`.

### Visual Identity

Dark-first, green-phosphor aesthetic. Terminal/code feel — near-monochrome palette with phosphor green (`#4ADE6E`) as the single accent. Borders over shadows. All interactive components are client components (`"use client"`).
