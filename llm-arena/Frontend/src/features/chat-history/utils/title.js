import { DEFAULT_CONVERSATION_TITLE } from '../../../constants/index.js'

/**
 * Deterministic conversation titles derived from the first problem.
 * No AI is involved; nothing here claims otherwise.
 */

const DEFAULT_MAX_LENGTH = 48

/** Collapse whitespace/newlines, truncate at a word boundary, fall back for empty input. */
export function titleFromProblem(problem, maxLength = DEFAULT_MAX_LENGTH) {
  const collapsed = String(problem ?? '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!collapsed) return DEFAULT_CONVERSATION_TITLE
  if (collapsed.length <= maxLength) return collapsed

  const windowed = collapsed.slice(0, maxLength)
  const lastSpace = windowed.lastIndexOf(' ')
  const cut = lastSpace > maxLength * 0.5 ? windowed.slice(0, lastSpace) : windowed
  return `${cut.trimEnd()}…`
}
