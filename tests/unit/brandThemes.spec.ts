import { describe, it, expect } from 'vitest'
import {
  AA_TEXT,
  BRANDS,
  BRAND_TOKENS,
  REPOINTED,
  SHARED,
  SHARED_VARIABLES,
  TOTAL_VARIABLES,
  ratio,
} from '@/lib/brandThemes'


describe('ratio — WCAG relative contrast', () => {
  it('is 21:1 for black on white and 1:1 for a colour on itself', () => {
    expect(ratio('#000000', '#FFFFFF')).toBeCloseTo(21, 2)
    expect(ratio('#4ADE6E', '#4ADE6E')).toBeCloseTo(1, 5)
  })

  it('is symmetric in its arguments', () => {
    expect(ratio('#DA3743', '#FFFFFF')).toBeCloseTo(ratio('#FFFFFF', '#DA3743'), 10)
  })
})

describe('brand collections', () => {
  it('carries all three OTKit collections', () => {
    expect(BRANDS.map((b) => b.id)).toEqual(['diner', 'restaurant', 'iconic'])
  })

  it('re-points every brand token to a distinct value per brand', () => {
    for (const { key } of BRAND_TOKENS) {
      const values = BRANDS.map((b) => b[key] as string)
      expect(new Set(values).size).toBe(BRANDS.length)
    }
  })

  it('accounts for the deck\'s 6 re-pointed + 278 shared variables', () => {
    expect(REPOINTED).toBe(6)
    expect(SHARED_VARIABLES).toBe(278)
    expect(TOTAL_VARIABLES).toBe(284)
  })
})


describe('shared tokens', () => {
  it('keeps body ink and muted text AA-legible on the shared card surface', () => {
    expect(ratio(SHARED.ink, SHARED.bg)).toBeGreaterThanOrEqual(AA_TEXT)
    expect(ratio(SHARED.alt, SHARED.bg)).toBeGreaterThanOrEqual(AA_TEXT)
  })

  it('keeps ink AA-legible on every brand-tinted stage', () => {
    for (const b of BRANDS) {
      expect(ratio(SHARED.ink, b.altLight)).toBeGreaterThanOrEqual(AA_TEXT)
    }
  })
})
