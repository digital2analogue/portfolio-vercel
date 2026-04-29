# CLAUDE.md

This file provides guidance when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server (Next.js 16, http://localhost:3000)
npm run build          # contrast check → next build (contrast gate blocks on failure)
npm run lint           # ESLint via next lint
npm run check-contrast # Run WCAG AA check in isolation
npm run sync-tokens    # Compare globals.css token block against brand-tokens build output
```

## Architecture

**Next.js 16 App Router** portfolio site with Tailwind CSS v4 and TypeScript. No testing framework is configured.

### Design Token System

This repo consumes tokens from the **brand-tokens** repo (`../../brand-tokens`). The base dark theme tokens are inlined into `app/globals.css` — the comment block at the top of that file marks the section clearly.

#### Source of truth hierarchy

```
brand-tokens/tokens/base/           ← edit here first
  ↓ build (node scripts/build-brands.mjs in brand-tokens)
brand-tokens/build/css/variables.css  ← built output (base dark theme)
  ↓ sync-tokens compares against
app/globals.css                     ← inlined token block, consumed by Tailwind + components
```

**Never edit color values directly in `globals.css`.** If a token value needs to change, change it in brand-tokens, rebuild, and copy the updated block across. If a token is needed urgently, add it locally with a comment `/* TODO: move to brand-tokens */` and run `sync-tokens` to surface it.

#### Token layers in globals.css

1. **Primitives** (`--primitive-color-*`) — raw hex values. Never reference these in components.
2. **Semantic** (`--color-*`) — named roles referenced in UI code.
3. **Portfolio-specific** — layout, bloom effects not yet in brand-tokens; marked with a comment block.
4. **Tailwind bridge** — `@theme inline` block re-exposes semantic tokens as Tailwind utilities.

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
