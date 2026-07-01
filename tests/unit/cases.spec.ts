import { describe, it, expect } from 'vitest'
import { CASES } from '@/lib/cases'
import { CASE_CONTENT } from '@/lib/caseContent'

describe('CASES data integrity', () => {
  it('has at least one case study', () => {
    expect(CASES.length).toBeGreaterThan(0)
  })

  it('has unique slugs', () => {
    const slugs = CASES.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has unique index numbers', () => {
    const indexes = CASES.map((c) => c.index)
    expect(new Set(indexes).size).toBe(indexes.length)
  })

  it('has url-safe slugs (lowercase letters, digits, hyphens)', () => {
    for (const c of CASES) {
      expect(c.slug, `slug "${c.slug}"`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('fills every required text field', () => {
    for (const c of CASES) {
      expect(c.title.trim(), `${c.slug} title`).not.toBe('')
      expect(c.company.trim(), `${c.slug} company`).not.toBe('')
      expect(c.year.trim(), `${c.slug} year`).not.toBe('')
      expect(c.role.trim(), `${c.slug} role`).not.toBe('')
      expect(c.summary.trim(), `${c.slug} summary`).not.toBe('')
      expect(c.status.trim(), `${c.slug} status`).not.toBe('')
    }
  })

  it('has at least one tag and one metric per case', () => {
    for (const c of CASES) {
      expect(c.tags.length, `${c.slug} tags`).toBeGreaterThan(0)
      expect(c.metrics.length, `${c.slug} metrics`).toBeGreaterThan(0)
    }
  })
})

describe('CASES ↔ CASE_CONTENT linkage', () => {
  // /work/[slug] pre-renders every case without an href override
  // (see generateStaticParams in app/work/[slug]/page.tsx). A case that
  // lacks matching CASE_CONTENT would build a broken detail page.
  it('every case without an href override has detail-page content', () => {
    for (const c of CASES.filter((c) => !c.href)) {
      expect(CASE_CONTENT[c.slug], `missing CASE_CONTENT for "${c.slug}"`).toBeDefined()
    }
  })

  it('content slugs match their record keys', () => {
    for (const [key, content] of Object.entries(CASE_CONTENT)) {
      expect(content.slug).toBe(key)
    }
  })

  it('no orphaned content entries (content without a case)', () => {
    const caseSlugs = new Set(CASES.map((c) => c.slug))
    for (const key of Object.keys(CASE_CONTENT)) {
      expect(caseSlugs.has(key), `CASE_CONTENT "${key}" has no CASES entry`).toBe(true)
    }
  })
})
