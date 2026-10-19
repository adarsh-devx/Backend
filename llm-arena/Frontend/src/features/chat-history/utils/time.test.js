import { describe, expect, it } from 'vitest'
import { formatDateTime, formatRelativeTime } from './time.js'

const NOW = Date.parse('2026-10-19T12:00:00.000Z')

describe('formatRelativeTime', () => {
  it('describes recent timestamps relatively', () => {
    expect(formatRelativeTime('2026-10-19T11:59:45.000Z', NOW)).toBe('just now')
    expect(formatRelativeTime('2026-10-19T11:55:00.000Z', NOW)).toBe('5m ago')
    expect(formatRelativeTime('2026-10-19T09:00:00.000Z', NOW)).toBe('3h ago')
    expect(formatRelativeTime('2026-10-17T12:00:00.000Z', NOW)).toBe('2d ago')
  })

  it('uses an absolute date beyond a week', () => {
    expect(formatRelativeTime('2026-09-01T12:00:00.000Z', NOW)).toBe('Sep 1, 2026')
  })

  it('never renders future drift as negative time', () => {
    expect(formatRelativeTime('2026-10-19T12:30:00.000Z', NOW)).toBe('just now')
  })

  it('marks invalid timestamps', () => {
    expect(formatRelativeTime('not-a-date', NOW)).toBe('—')
  })
})

describe('formatDateTime', () => {
  it('formats a valid ISO timestamp and degrades gracefully', () => {
    expect(formatDateTime('2026-10-19T11:59:45.000Z')).toContain('2026')
    expect(formatDateTime('bogus')).toBe('unknown')
  })
})
