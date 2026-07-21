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

**Visual baselines are generated ON the CI runner, never locally** — font rasterization differs across machines, so locally-generated baselines fail in CI. After an intentional visual change, run the "Update visual baselines" workflow from the Actions tab (it regenerates and commits them on the runner). `main` has branch protection requiring the `checks` and `visual` status checks; Dependabot files weekly grouped bumps and the `dependabot-automerge` workflow merges them once CI passes (major npm bumps stay manual).

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

`scripts/check-contrast.mjs` runs before every build. It validates every text/background color pairing against WCAG AA (4.5:1 minimum).

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

The Parsimony (`/work/system`) case-study diagrams are **hand-authored SVGs**, rasterized to 2× PNG by `npm run render-diagrams` (`scripts/render-diagrams.mjs`, headless chromium — mirrors `generate-og.mjs`; uses the bundled browser at `/opt/pw-browsers/chromium`, never `playwright install`). Edit the `.svg`, re-run `render-diagrams`, commit both. House style: `#0A0D0A` canvas, `#4ADE6E` phosphor accent, Space Grotesk titles / JetBrains Mono labels, green = shipped / amber-dashed = planned. Because these PNGs embed in `/work/system`, a diagram edit shifts that page's visual baseline → run the "Update visual baselines" workflow **last** (see the baseline rule above).

**Deliberate code/docs gap (2026-07-14):** the case study + diagrams present Parsimony's token model as **two-tier, semantic-only** (primitives → semantic, no component tier). This is the *target* state — the Parsimony repo still ships the `component.*` tier until the migration in **parsimony#114** lands. So the case study intentionally **leads the code**; do not "correct" it back to a three-tier / component-token framing. (Decision recorded in `parsimony/docs/decisions.md`, 2026-07-14; case study shipped in PR #33.)

### Interactive Case Demos (in-page live components)

Case bodies render a **closed, typed block union** (`Block` in `lib/caseContent.ts`) via `components/CaseBlocks.tsx` — data, not MDX/JSX. Three block variants embed live/interactive content:

- `demo` — a registry-keyed React component. Add a component to `components/demos/`, register it in `components/demos/registry.ts` under a `DemoKey`, then reference it as `{ type: "demo", demo: "<key>", frameLabel?, caption? }`. `CaseBlocks` wraps it in the `.demo-frame` chrome. Two demos exist, both on `/work/ot-design-system` ("Table Statuses"): `reservation-status` (OTKit status dropdown, WAI-ARIA listbox, grouped Pre-dining / During service; data in `lib/reservationStates.ts`) and `table-status` (floor-plan tile contrast audit; data in `lib/tableStatus.ts`).
- `embed` — a lazy 16/10 iframe of a deployed prototype (e.g. decisioning-table on `/work/c1-decision-engine`), rendered by `CaseEmbed`.
- `outcome-demo` — the standalone decision-engine outcome-toggle device card (`OutcomeToggleDemo`).

Conventions:
- Demos are **faithful OTKit light-mode** surfaces framed inside the dark site. Their palette is **demo-local** — scoped classes (`.demo-frame`, `.rr-demo`, `.rr-status*`, `.rr-tiles*` in `globals.css`) with OTKit hex values that must NOT leak into the dark Parsimony system. Register every demo text/bg pairing in `scripts/check-contrast.mjs` PAIRINGS as resolved hex.
- Icons are the **real OTKit vectors** inlined in `components/demos/otkitIcons.ts` (`fill=currentColor`), generated from the exported icon library — no CDN/egress dependency.
- **Visual-regression note:** `tests/visual/pages.spec.ts` only snapshots `/`, `/work`, `/about`, `/contact`, `/tokens`, and `/work/c1-decision-engine`. The OTKit demo routes (`/work/ot-design-system`, `/work/ot-reservations`) are NOT snapshotted, so **demo-only changes need no baseline regen** (the "Update visual baselines" workflow is irrelevant to them).
- Dev gotcha: a stale `next-server` on port 3000 from an earlier run will silently serve the OLD build (`npm run start` fails to bind and you verify nothing). If a rebuild "didn't take," `kill` the PID holding 3000 (find via `ps aux | grep next-server`) and restart.

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
