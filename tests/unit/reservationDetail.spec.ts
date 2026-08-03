import { describe, it, expect } from 'vitest'
import {
  activeSectionAt,
  NOTE_SECTIONS,
  HISTORY_STATS,
  CURRENT_VISIT,
  ALL_VISITS,
} from '@/lib/reservationDetail'

// Section tops as the demo measures them: relative to the scroll container,
// already offset by the sticky strip's height. Ascending by construction.
const OFFSETS = [0, 120, 240, 360, 480]

describe('activeSectionAt — reservation-detail scroll spy', () => {
  it('rests on the first section at the top of the scroll', () => {
    expect(activeSectionAt(0, OFFSETS)).toBe(0)
  })

  it('holds a section until the next one reaches the strip', () => {
    expect(activeSectionAt(118, OFFSETS)).toBe(0)
    expect(activeSectionAt(120, OFFSETS)).toBe(1)
    expect(activeSectionAt(238, OFFSETS)).toBe(1)
  })

  it('absorbs sub-pixel undershoot after a programmatic jump', () => {
    // scrollTo({top: 240}) can settle at 239.4 — the 1px slack must still read
    // that as section 2, or clicking a tab leaves the previous tab highlighted.
    expect(activeSectionAt(239.4, OFFSETS)).toBe(2)
    expect(activeSectionAt(119, OFFSETS)).toBe(1)
  })

  it('reaches the last section and stays there past the end', () => {
    expect(activeSectionAt(480, OFFSETS)).toBe(4)
    expect(activeSectionAt(9999, OFFSETS)).toBe(4)
  })

  it('never returns an index outside the offsets it was given', () => {
    for (const top of [-50, 0, 77, 480, 10_000]) {
      const i = activeSectionAt(top, OFFSETS)
      expect(i).toBeGreaterThanOrEqual(0)
      expect(i).toBeLessThan(OFFSETS.length)
    }
  })

  it('handles a single section without going out of range', () => {
    expect(activeSectionAt(0, [0])).toBe(0)
    expect(activeSectionAt(500, [0])).toBe(0)
  })
})

describe('reservation-detail data', () => {
  it('gives every note section a unique id, icon and accessible label', () => {
    const ids = NOTE_SECTIONS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const section of NOTE_SECTIONS) {
      expect(section.icon).not.toBe('')
      expect(section.label.trim()).not.toBe('')
    }
  })

  it('ends on the history section, which the strip renders last', () => {
    expect(NOTE_SECTIONS.at(-1)?.id).toBe('history')
  })

  it('gives every non-history section an empty-state placeholder', () => {
    for (const section of NOTE_SECTIONS.filter((s) => s.id !== 'history')) {
      expect(section.placeholder).not.toBe('')
    }
  })

  it('keeps the four history counters non-negative and labelled', () => {
    expect(HISTORY_STATS).toHaveLength(4)
    for (const stat of HISTORY_STATS) {
      expect(stat.value).toBeGreaterThanOrEqual(0)
      expect(stat.label.trim()).not.toBe('')
    }
  })

  it('widens, never replaces, the current visit when scoped to all visits', () => {
    expect(ALL_VISITS.length).toBeGreaterThan(CURRENT_VISIT.length)
    for (const visit of CURRENT_VISIT) {
      expect(ALL_VISITS).toContain(visit)
    }
  })

  it('keeps visit and event ids unique across the widest scope', () => {
    const visitIds = ALL_VISITS.map((v) => v.id)
    expect(new Set(visitIds).size).toBe(visitIds.length)
    const eventIds = ALL_VISITS.flatMap((v) => v.events.map((e) => e.id))
    expect(new Set(eventIds).size).toBe(eventIds.length)
  })
})
