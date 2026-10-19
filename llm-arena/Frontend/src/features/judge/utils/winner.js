import { SCORE_MIN, SCORE_MAX } from '../../../constants/index.js'

/**
 * Winner resolution — pure, deterministic, kept outside UI components so it
 * can be unit-tested and reused by export/copy logic.
 *
 * Convention: higher scores (0–10) indicate the better solution. An explicit
 * judge recommendation is authoritative when it is a recognisable value —
 * the UI never silently contradicts it. The score-derived winner is the
 * fallback when no usable recommendation exists; equal scores are a tie, and
 * missing/invalid scores yield an unavailable state.
 */

export const WINNER = Object.freeze({
  A: 'A',
  B: 'B',
  TIE: 'tie',
  UNAVAILABLE: 'unavailable',
})

export function isValidScore(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= SCORE_MIN &&
    value <= SCORE_MAX
  )
}

export function formatScore(value) {
  return isValidScore(value) ? `${value}/10` : '—'
}

/** Normalise judge input to 'A' | 'B' | 'tie' | null (invalid → null). */
function normalizeExplicit(value) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  if (normalized === 'a') return WINNER.A
  if (normalized === 'b') return WINNER.B
  if (normalized === 'tie' || normalized === 'draw') return WINNER.TIE
  return null
}

/**
 * @param {{solutionAScore?: unknown, solutionBScore?: unknown,
 *          recommendedSolution?: unknown} | null | undefined} judge
 * @returns {{winner: string, source: 'judge'|'scores'|'none'}}
 *   source tells the UI whether the winner came from the judge's explicit
 *   recommendation or was derived from the scores.
 */
export function resolveWinner(judge) {
  if (!judge || typeof judge !== 'object') {
    return { winner: WINNER.UNAVAILABLE, source: 'none' }
  }

  const explicit = normalizeExplicit(judge.recommendedSolution)
  if (explicit) {
    return { winner: explicit, source: 'judge' }
  }

  const scoreA = judge.solutionAScore
  const scoreB = judge.solutionBScore
  if (!isValidScore(scoreA) || !isValidScore(scoreB)) {
    return { winner: WINNER.UNAVAILABLE, source: 'none' }
  }
  if (scoreA > scoreB) return { winner: WINNER.A, source: 'scores' }
  if (scoreB > scoreA) return { winner: WINNER.B, source: 'scores' }
  return { winner: WINNER.TIE, source: 'scores' }
}

/** Short label for badges, verdict rows, and exports. */
export function winnerLabel(winner) {
  switch (winner) {
    case WINNER.A:
      return 'Solution A'
    case WINNER.B:
      return 'Solution B'
    case WINNER.TIE:
      return 'Tie'
    default:
      return 'Unavailable'
  }
}

/** One-line verdict sentence used in the verdict row and copy/export. */
export function verdictSummary(judge) {
  const { winner, source } = resolveWinner(judge)
  switch (winner) {
    case WINNER.A:
    case WINNER.B:
      return `Recommended: ${winnerLabel(winner)} (${source === 'judge' ? "judge's pick" : 'higher score'})`
    case WINNER.TIE:
      return 'Tie — no clear winner (both scores equal)'
    default:
      return 'Inconclusive — scores unavailable'
  }
}
