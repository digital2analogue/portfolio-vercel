# CLAUDE.md

This file provides guidance when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server (Next.js 16, http://localhost:3000)
npm run build          # contrast check → next build (contrast gate blocks on failure)
npm run lint           # ESLint via next lint
npm run check-contrast # Run WCAG AA check in isolation
npm run sync-tokens    # Check installed @digital2analogue2/tokens version against the latest published
```

## Architecture

**Next.js 16 App Router** portfolio site with Tailwind CSS v4 and TypeScript. No testing framework is configured.

### Design Token System

This repo consumes tokens from the **brand-tokens** design system as the published npm package **`@digital2analogue2/tokens`**. `app/globals.css` imports the base dark-theme CSS (`@digital2analogue2/tokens/base.css`) — it is no longer hand-copied. The token *values* are never edited here; change them in brand-tokens, publish a new package version, and `npm install` it.

#### Source of truth hierarchy

```
brand-tokens/tokens/base/              ← edit token values here first
  ↓ build (node scripts/build-brands.mjs in brand-tokens)
brand-tokens/packages/tokens           ← published as @digital2analogue2/tokens
  ↓ npm install
node_modules/@digital2analogue2/tokens/css/variables.css
  ↓ @import "@digital2analogue2/tokens/base.css"
app/globals.css                        ← imports base + a thin override layer
```

`npm run sync-tokens` checks the installed package version against the latest published, so this consumer can't silently fall behind the source of truth.

#### Token layers in globals.css

1. **Imported base** — `@import "@digital2analogue2/tokens/base.css"` provides all primitives, semantic roles, and typography shorthands (fixed base values).
2. **Portfolio override `:root`** — re-declares ONLY the deltas on top of the package: responsive `clamp()` scaling for the larger spacing/type steps, and font-family tokens that defer to the next/font variables. Cascades through because semantic/shorthand tokens reference primitives via `var()`.
3. **Portfolio-specific** — layout widths, phosphor bloom not yet in brand-tokens.
4. **Tailwind bridge** — `@theme inline` block re-exposes semantic tokens as Tailwind utilities.

To change a token value, edit brand-tokens → publish → `npm install @digital2analogue2/tokens@latest`. For a portfolio-only override, add it to the override `:root` in `globals.css`.

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
- `lib/tokenCatalog.ts` — Token documentation data for the `/tokens` viewer page (display-only hex values, not runtime references)

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
