import { describe, expect, it } from 'vitest'
import {
  WINNER,
  formatScore,
  isValidScore,
  resolveWinner,
  verdictSummary,
  winnerLabel,
} from './winner.js'

describe('resolveWinner', () => {
  it('honours an explicit judge recommendation over the scores', () => {
    expect(resolveWinner({ solutionAScore: 3, solutionBScore: 9, recommendedSolution: 'A' })).toEqual(
      { winner: WINNER.A, source: 'judge' },
    )
    expect(
      resolveWinner({ solutionAScore: 9, solutionBScore: 3, recommendedSolution: 'b' }),
    ).toEqual({ winner: WINNER.B, source: 'judge' })
    expect(
      resolveWinner({ solutionAScore: 5, solutionBScore: 5, recommendedSolution: '  Tie ' }),
    ).toEqual({ winner: WINNER.TIE, source: 'judge' })
  })

  it('derives the winner from scores when no recommendation exists', () => {
    expect(resolveWinner({ solutionAScore: 9, solutionBScore: 7 })).toEqual({
      winner: WINNER.A,
      source: 'scores',
    })
    expect(resolveWinner({ solutionAScore: 7, solutionBScore: 9 })).toEqual({
      winner: WINNER.B,
      source: 'scores',
    })
  })

  it('reports a tie when valid scores are equal', () => {
    expect(resolveWinner({ solutionAScore: 8, solutionBScore: 8 })).toEqual({
      winner: WINNER.TIE,
      source: 'scores',
    })
  })

  it('is unavailable when the judge is missing', () => {
    expect(resolveWinner(null)).toEqual({ winner: WINNER.UNAVAILABLE, source: 'none' })
    expect(resolveWinner(undefined)).toEqual({ winner: WINNER.UNAVAILABLE, source: 'none' })
  })

  it('is unavailable when scores are missing or invalid', () => {
    expect(resolveWinner({ solutionAScore: '8', solutionBScore: 9 })).toEqual({
      winner: WINNER.UNAVAILABLE,
      source: 'none',
    })
    expect(resolveWinner({ solutionAScore: 11, solutionBScore: 9 })).toEqual({
      winner: WINNER.UNAVAILABLE,
      source: 'none',
    })
    expect(resolveWinner({ solutionAScore: Number.NaN, solutionBScore: 9 })).toEqual({
      winner: WINNER.UNAVAILABLE,
      source: 'none',
    })
  })

  it('ignores an unusable recommendation and derives from scores', () => {
    expect(
      resolveWinner({ solutionAScore: 9, solutionBScore: 4, recommendedSolution: 'maybe' }),
    ).toEqual({ winner: WINNER.A, source: 'scores' })
  })

  it('keeps an explicit recommendation even when scores are unusable', () => {
    expect(
      resolveWinner({ solutionAScore: null, solutionBScore: null, recommendedSolution: 'B' }),
    ).toEqual({ winner: WINNER.B, source: 'judge' })
  })
})

describe('score helpers', () => {
  it('validates the 0–10 scale', () => {
    expect(isValidScore(0)).toBe(true)
    expect(isValidScore(10)).toBe(true)
    expect(isValidScore(-1)).toBe(false)
    expect(isValidScore(10.5)).toBe(false)
    expect(isValidScore('8')).toBe(false)
    expect(isValidScore(null)).toBe(false)
  })

  it('formats valid scores and marks invalid ones', () => {
    expect(formatScore(8)).toBe('8/10')
    expect(formatScore(undefined)).toBe('—')
  })
})

describe('labels and summaries', () => {
  it('labels every winner state', () => {
    expect(winnerLabel(WINNER.A)).toBe('Solution A')
    expect(winnerLabel(WINNER.B)).toBe('Solution B')
    expect(winnerLabel(WINNER.TIE)).toBe('Tie')
    expect(winnerLabel(WINNER.UNAVAILABLE)).toBe('Unavailable')
  })

  it('summarises ties and unavailable results honestly', () => {
    expect(verdictSummary({ solutionAScore: 8, solutionBScore: 8 })).toMatch(/Tie/)
    expect(verdictSummary(null)).toMatch(/Inconclusive/)
    expect(verdictSummary({ solutionAScore: 9, solutionBScore: 6 })).toMatch(
      /Recommended: Solution A/,
    )
  })
})
