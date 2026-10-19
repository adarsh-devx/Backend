import { MOCK_FAILURE_PREFIX } from '../../constants/index.js'
import { buildMockComparison } from '../../data/mock/fixtures.js'

/**
 * Mock comparison service.
 *
 * Stand-in for the future `POST /api/comparisons` endpoint. Asynchronous,
 * fixed shape, deterministic fixtures — swappable for an HTTP call without
 * touching any component (callers only see a Promise of
 * `{ solutionA, solutionB, judge }`).
 *
 * Controlled failure trigger: problems starting with MOCK_FAILURE_PREFIX
 * ("/fail") reject, so failure + retry states are demonstrable without
 * random flakiness.
 */

const MIN_DELAY_MS = 700
const MAX_DELAY_MS = 1300

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateComparison(problem) {
  const trimmed = (problem ?? '').trim()

  return delay(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)).then(() => {
    if (!trimmed) {
      throw new Error('Please describe a problem before sending.')
    }
    if (trimmed.toLowerCase().startsWith(MOCK_FAILURE_PREFIX)) {
      throw new Error(
        `Mock generation failed (failure trigger "${MOCK_FAILURE_PREFIX}"). Remove the prefix and retry.`,
      )
    }
    return buildMockComparison(trimmed)
  })
}
