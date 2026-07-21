import { describe, it, expect } from 'vitest'
import {
  lintSnippet,
  SAMPLE_VIOLATIONS,
  SAMPLE_CLEAN,
} from '@/lib/checkUsageRules'

const rulesFor = (code: string) => lintSnippet(code).map((v) => v.rule).sort()

describe('lintSnippet — check_usage detectors', () => {
  it('flags every rule in the messy sample, one each', () => {
    expect(rulesFor(SAMPLE_VIOLATIONS)).toEqual([
      'font-family',
      'font-size',
      'font-weight',
      'no-hex',
      'no-primitive',
    ])
  })

  it('passes the compliant sample with zero violations', () => {
    expect(lintSnippet(SAMPLE_CLEAN)).toEqual([])
  })

  it('flags a hardcoded hex but not a var(--color-*) token', () => {
    expect(rulesFor('color: #4ade6e;')).toContain('no-hex')
    expect(rulesFor('color: var(--color-foreground-accent);')).not.toContain('no-hex')
  })

  it('flags a primitive reference but not a semantic one', () => {
    expect(rulesFor('background: var(--primitive-color-green-500);')).toContain('no-primitive')
    expect(rulesFor('background: var(--color-background-alt);')).not.toContain('no-primitive')
  })

  it('flags hardcoded font-size/weight but not token-driven type', () => {
    expect(rulesFor('font-size: 13px;')).toContain('font-size')
    expect(rulesFor('font-weight: 700;')).toContain('font-weight')
    expect(rulesFor('font: var(--font-label-strong-small);')).toEqual([])
  })

  it('flags an unapproved family but accepts approved + generic keywords', () => {
    expect(rulesFor('font-family: Inter, sans-serif;')).toContain('font-family')
    expect(rulesFor('font-family: var(--font-family-sans);')).not.toContain('font-family')
    expect(rulesFor('font-family: "JetBrains Mono", monospace;')).not.toContain('font-family')
  })

  it('reports a 1-based line and column', () => {
    const v = lintSnippet('\n  color: #fff;')
    expect(v[0].line).toBe(2)
    expect(v[0].col).toBeGreaterThan(1)
  })

  it('ignores comment lines', () => {
    expect(lintSnippet('// color: #fff is wrong')).toEqual([])
  })
})
