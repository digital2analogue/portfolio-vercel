import { describe, it, expect } from 'vitest'
import * as tokens from '@/lib/tokens'

// lib/tokens.ts is a thin re-export of CSS custom properties. Every value
// must stay a var() reference — a raw hex or rgb() literal here would
// bypass the brand-tokens system and silently drift from the design system.
const VAR_REF = /^var\(--[a-z0-9-]+\)$/

describe('T (semantic token object)', () => {
  it('exposes only var() references', () => {
    for (const [name, value] of Object.entries(tokens.T)) {
      expect(value, `T.${name}`).toMatch(VAR_REF)
    }
  })

  it('covers the core semantic roles', () => {
    expect(tokens.T).toMatchObject({
      bg: expect.any(String),
      surface: expect.any(String),
      border: expect.any(String),
      fg: expect.any(String),
      accent: expect.any(String),
    })
  })
})

describe('font exports', () => {
  it('font families are var() references', () => {
    expect(tokens.sans).toMatch(VAR_REF)
    expect(tokens.serif).toMatch(VAR_REF)
    expect(tokens.mono).toMatch(VAR_REF)
  })

  it('typography shorthands are var() references', () => {
    const shorthands = [
      tokens.fontDisplay,
      tokens.fontTitleLarge,
      tokens.fontTitleMedium,
      tokens.fontTitleSmall,
      tokens.fontBodyLarge,
      tokens.fontBodyMedium,
      tokens.fontBodySmall,
      tokens.fontLabelLarge,
      tokens.fontLabelMedium,
      tokens.fontLabelSmall,
      tokens.fontCode,
    ]
    for (const value of shorthands) {
      expect(value).toMatch(VAR_REF)
    }
  })
})
