import { describe, it, expect } from 'vitest'
import {
  AA_TEXT,
  BRANDS,
  BRAND_TOKENS,
  REPOINTED,
  SHARED,
  SHARED_VARIABLES,
  TOTAL_VARIABLES,
  clearsEveryState,
  ratio,
  stateAudit,
} from '@/lib/brandThemes'

const brand = (id: string) => BRANDS.find((b) => b.id === id)!

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

describe('stateAudit — white label across the action ramp', () => {
  it('passes AA at the resting fill for every brand', () => {
    for (const b of BRANDS) {
      const resting = stateAudit(b).find((s) => s.state === 'default')!
      expect(resting.ratio).toBeGreaterThanOrEqual(AA_TEXT)
      expect(resting.passes).toBe(true)
    }
  })

  it('clears AA in every state for Iconic — the argument for black', () => {
    expect(clearsEveryState(brand('iconic'))).toBe(true)
  })

  it('fails AA on the legacy hover fills, which is why they are not rendered as text', () => {
    for (const id of ['diner', 'restaurant']) {
      expect(clearsEveryState(brand(id))).toBe(false)
      const hover = stateAudit(brand(id)).find((s) => s.state === 'hover')!
      expect(hover.passes).toBe(false)
      expect(hover.ratio).toBeLessThan(AA_TEXT)
    }
  })

  it('reports one entry per ramp state', () => {
    expect(stateAudit(brand('iconic')).map((s) => s.state)).toEqual([
      'default',
      'hover',
      'pressed',
    ])
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
