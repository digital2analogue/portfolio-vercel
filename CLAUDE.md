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
