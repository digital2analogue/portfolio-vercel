# Testing Guide — portfolio-vercel

This guide explains how to run unit and visual regression tests for the portfolio.

## Quick Start

```bash
# Install dependencies
npm install

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:ui

# Run visual regression tests
npm run test:visual

# Run visual regression tests in headed mode
npx playwright test --headed
```

## Unit Testing (Vitest)

Unit tests validate individual components and utilities in isolation.

**Framework:** Vitest (modern, fast, ESM-first)  
**Test files:** `tests/unit/**/*.spec.ts`

### Example unit test

```typescript
// tests/unit/example.spec.ts
import { describe, it, expect } from 'vitest'

describe('My Component', () => {
  it('renders correctly', () => {
    const result = myFunction()
    expect(result).toBe('expected value')
  })
})
```

### Run unit tests

```bash
# Run all unit tests
npm run test

# Run in watch mode (re-runs on file changes)
npm run test:ui

# Run a specific test file
npm run test tests/unit/example.spec.ts

# Run tests matching a pattern
npm run test -- --grep "renders"
```

## Visual Regression Testing (Playwright)

Visual regression tests compare screenshots of pages against baselines to catch unintended visual changes.

**Framework:** Playwright (open-source, powerful)  
**Test files:** `tests/visual/**/*.spec.ts`

### How it works

1. **First run** — Playwright captures screenshots and saves them as baselines in `tests/visual/<test-name>.png`
2. **Subsequent runs** — New screenshots are compared against baselines. Differences fail the test.
3. **Review diffs** — If a change is intentional, update baselines with `--update-snapshots`

### Run visual tests

```bash
# Run all visual regression tests (requires dev server running on http://localhost:3000)
npm run test:visual

# Run in headed mode (see browser)
npx playwright test --headed

# Update baselines after intentional visual changes
npm run test:visual -- --update-snapshots

# Run a specific test
npx playwright test pages.spec.ts

# Run with visual debugging
npx playwright test --debug
```

## CI/CD Integration

Both test suites run in CI environments. Visual regression tests:
- Retry twice if they fail (network flakiness)
- Run with single worker (no parallelization) for consistency
- Generate HTML reports in `test-results/`

## Troubleshooting

**"Dev server not reachable"** — Start the dev server first: `npm run dev`

**Visual test snapshot mismatch** — Review the diff in the HTML report, then either:
- Fix the bug that caused the change
- Update the baseline: `npm run test:visual -- --update-snapshots`

**Flaky visual tests** — Playwright waits for network idle by default. If tests still flake, add waits:
```typescript
await page.waitForLoadState('networkidle')
```

## Best Practices

- **Keep tests focused** — One visual concern per test
- **Update baselines carefully** — Review diffs before `--update-snapshots`
- **Run locally before pushing** — Catch issues early
- **Commit baseline images** — They're part of your source of truth
