import { describe, expect, it } from 'vitest'
import { titleFromProblem } from './title.js'
import { DEFAULT_CONVERSATION_TITLE } from '../../../constants/index.js'

describe('titleFromProblem', () => {
  it('falls back for empty or whitespace-only input', () => {
    expect(titleFromProblem('')).toBe(DEFAULT_CONVERSATION_TITLE)
    expect(titleFromProblem('   \n\t ')).toBe(DEFAULT_CONVERSATION_TITLE)
    expect(titleFromProblem(undefined)).toBe(DEFAULT_CONVERSATION_TITLE)
  })

  it('collapses whitespace and keeps short titles intact', () => {
    expect(titleFromProblem('  How do I   cache \n things?  ')).toBe('How do I cache things?')
  })

  it('truncates at a word boundary with an ellipsis', () => {
    const title = titleFromProblem('How should I structure config files for command line tools')
    expect(title.endsWith('…')).toBe(true)
    expect(title.length).toBeLessThanOrEqual(49)
    expect(title).toBe('How should I structure config files for command…')
  })

  it('handles a single long word without spaces', () => {
    const title = titleFromProblem('a'.repeat(80))
    expect(title.length).toBeLessThanOrEqual(49)
    expect(title.endsWith('…')).toBe(true)
  })

  it('honours a custom max length', () => {
    expect(titleFromProblem('short enough', 8)).toBe('short…')
  })
})
