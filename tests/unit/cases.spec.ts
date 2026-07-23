import { existsSync } from 'node:fs'
import { join } from 'node:path'
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

  // Every local media path in a case body must exist in public/ — a renamed
  // or deleted asset would otherwise ship as a silent 404.
  it('every referenced local media asset exists on disk', () => {
    const paths: Array<{ where: string; src: string }> = []
    for (const [key, content] of Object.entries(CASE_CONTENT)) {
      for (const b of content.blocks) {
        if (b.type === 'image' && b.src) paths.push({ where: key, src: b.src })
        if (b.type === 'image-pair')
          for (const img of b.images) if (img.src) paths.push({ where: key, src: img.src })
        if (b.type === 'video') {
          paths.push({ where: key, src: b.src })
          if (b.poster) paths.push({ where: key, src: b.poster })
        }
        if (b.type === 'embed' && b.poster) paths.push({ where: key, src: b.poster })
        if (b.type === 'diagram') {
          paths.push({ where: key, src: b.src })
          // The rasterized PNG is the declared fallback when the SVG isn't inlined
          paths.push({ where: key, src: b.src.replace(/\.svg$/, '.png') })
        }
      }
    }
    expect(paths.length).toBeGreaterThan(0)
    for (const { where, src } of paths) {
      if (!src.startsWith('/')) continue // external URLs are out of scope
      expect(existsSync(join(process.cwd(), 'public', src)), `${where}: missing ${src}`).toBe(true)
    }
  })

  // Video blocks replaced multi-megabyte GIFs — each must ship as mp4 with a
  // poster frame so reduced-motion users get a meaningful still.
  it('video blocks are mp4 and carry a poster', () => {
    for (const [key, content] of Object.entries(CASE_CONTENT)) {
      for (const b of content.blocks) {
        if (b.type !== 'video') continue
        expect(b.src, `${key} video src`).toMatch(/\.mp4$/)
        expect(b.poster, `${key} video poster`).toBeTruthy()
      }
    }
  })

  // Diagram blocks must point at SVG sources — DiagramBlock inlines and
  // animates the markup; a PNG here would silently skip the treatment.
  it('diagram blocks reference .svg sources', () => {
    for (const [key, content] of Object.entries(CASE_CONTENT)) {
      for (const b of content.blocks) {
        if (b.type !== 'diagram') continue
        expect(b.src, `${key} diagram src`).toMatch(/\.svg$/)
        expect(b.alt.trim(), `${key} diagram alt`).not.toBe('')
      }
    }
  })

  // The stats strip is the outcome headline for every case — a case body
  // without one regresses to numbers buried in prose.
  it('every case body carries a stats block with value + label pairs', () => {
    for (const [key, content] of Object.entries(CASE_CONTENT)) {
      const stats = content.blocks.filter((b) => b.type === 'stats')
      expect(stats.length, `${key} stats blocks`).toBeGreaterThan(0)
      for (const block of stats) {
        expect(block.items.length, `${key} stats items`).toBeGreaterThan(0)
        for (const item of block.items) {
          expect(item.value.trim(), `${key} stat value`).not.toBe('')
          expect(item.label.trim(), `${key} stat label`).not.toBe('')
        }
      }
    }
  })
})
