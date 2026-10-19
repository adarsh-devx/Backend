/** Central configuration shared across features. */

export const APP_NAME = 'Verdict'

/** Single LocalStorage key holding the versioned conversation store. */
export const STORAGE_KEY = 'verdict.conversations'
export const STORAGE_VERSION = 1

/** Explicit message lifecycle statuses (see data model in docs/README). */
export const MESSAGE_STATUS = Object.freeze({
  PENDING: 'pending',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
})

/** Judge scores use a fixed 0–10 scale, validated before display. */
export const SCORE_MIN = 0
export const SCORE_MAX = 10

export const MAX_PROBLEM_LENGTH = 4000

/**
 * Controlled mock-failure trigger: submitting a problem that starts with
 * this prefix makes the mock service reject, so failure/retry states can be
 * demonstrated deterministically without random flakiness.
 */
export const MOCK_FAILURE_PREFIX = '/fail'

export const DEFAULT_CONVERSATION_TITLE = 'New conversation'

/** Clickable example prompts on the welcome screen. */
export const EXAMPLE_PROMPTS = [
  'How should I cache expensive database queries in a web app?',
  'Should I add an index or build a materialized view for a slow dashboard query?',
  'How do I stop a long React list from re-rendering on every keystroke?',
]

/** Provider labels for mock solutions — always explicitly marked as mock. */
export const MOCK_PROVIDER_A = 'Mock Provider A'
export const MOCK_PROVIDER_B = 'Mock Provider B'
