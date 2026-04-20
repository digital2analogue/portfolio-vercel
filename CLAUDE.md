# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js 16, http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint via next lint
```

## Architecture

**Next.js 16 App Router** portfolio site with Tailwind CSS v4 and TypeScript. No testing framework is configured.

### Design Token System

The styling approach is token-based, with a two-layer system:

1. **CSS custom properties** (`app/globals.css`) — the source of truth for all design tokens (colors, typography, spacing, layout, motion, surface). Dark mode is default; light mode tokens exist under `.theme-light`.
2. **JS token re-exports** (`lib/tokens.ts`) — `T` object and font variables (`mono`, `sans`) that reference CSS vars via `var(--*)`. Components use these for inline styles: `color: T.accent`, `fontFamily: mono`.
3. **Tailwind bridge** — `@theme inline` block in `globals.css` re-exposes tokens so Tailwind utilities like `bg-bg`, `text-fg`, `font-mono` also work.

Components use inline styles with the `T` object rather than Tailwind classes as the primary styling pattern.

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

JetBrains Mono (primary/mono) and Instrument Sans (secondary/sans) loaded via `next/font/google` in `app/layout.tsx`. CSS variables `--font-jetbrains-mono` and `--font-instrument-sans` are set on `<html>`.

### Visual Identity

Terminal/code aesthetic — monospace-first, near-monochrome palette with a single accent color (`#3DDB84`). Borders over shadows. Sharp corners by default. All interactive components are client components (`"use client"`).
