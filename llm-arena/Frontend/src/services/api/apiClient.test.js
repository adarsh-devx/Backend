import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { generateComparison, mapComparisonResult } from './apiClient.js'

vi.mock('axios')

/** A realistic successful payload from POST /invoke (backend shape). */
const backendResult = {
  problem: 'How do I cache expensive queries?',
  solution_1: 'Use an in-process cache with a TTL.',
  solution_1_provider: 'Mistral (open-mistral-7b)',
  solution_2: 'Put Redis in front with a short TTL.',
  solution_2_provider: 'Cohere (command-r-plus-08-2024)',
  judge: {
    solution_1_score: 8,
    solution_2_score: 9,
    solution_1_reasoning: 'Correct but diverges when scaled out.',
    solution_2_reasoning: 'Shared invalidation is the real problem.',
  },
}

function successResponse(result = backendResult) {
  return { data: { message: 'Graph executed successfully', success: true, result } }
}

describe('mapComparisonResult', () => {
  it('maps the backend snake_case shape onto the UI data model', () => {
    expect(mapComparisonResult(backendResult)).toEqual({
      solutionA: {
        content: 'Use an in-process cache with a TTL.',
        provider: 'Mistral (open-mistral-7b)',
      },
      solutionB: {
        content: 'Put Redis in front with a short TTL.',
        provider: 'Cohere (command-r-plus-08-2024)',
      },
      judge: {
        solutionAScore: 8,
        solutionBScore: 9,
        reasoning:
          '**Solution A** — Correct but diverges when scaled out.\n\n' +
          '**Solution B** — Shared invalidation is the real problem.',
        recommendedSolution: null,
      },
    })
  })

  it('falls back to generic provider labels when the backend omits them', () => {
    const bare = { ...backendResult }
    delete bare.solution_1_provider
    delete bare.solution_2_provider
    const mapped = mapComparisonResult(bare)
    expect(mapped.solutionA.provider).toBe('Provider A')
    expect(mapped.solutionB.provider).toBe('Provider B')
  })

  it('renders only the reasoning that exists', () => {
    const mapped = mapComparisonResult({
      ...backendResult,
      judge: { ...backendResult.judge, solution_2_reasoning: '' },
    })
    expect(mapped.judge.reasoning).toBe('**Solution A** — Correct but diverges when scaled out.')
  })

  it('nulls out non-numeric scores instead of passing garbage to the UI', () => {
    const mapped = mapComparisonResult({
      ...backendResult,
      judge: { ...backendResult.judge, solution_1_score: '8' },
    })
    expect(mapped.judge.solutionAScore).toBeNull()
    expect(mapped.judge.solutionBScore).toBe(9)
  })
})

describe('generateComparison', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('POSTs the problem to /invoke and returns the mapped comparison', async () => {
    axios.post.mockResolvedValue(successResponse())

    const result = await generateComparison('  How do I cache expensive queries?  ')

    expect(axios.post).toHaveBeenCalledTimes(1)
    const [url, body] = axios.post.mock.calls[0]
    expect(url).toBe('http://localhost:3000/invoke')
    expect(body).toEqual({ input: 'How do I cache expensive queries?' })
    expect(result.solutionA.provider).toBe('Mistral (open-mistral-7b)')
    expect(result.judge.solutionBScore).toBe(9)
  })

  it('rejects an empty problem without touching the network', async () => {
    await expect(generateComparison('   ')).rejects.toThrow(/describe a problem/i)
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('honours the /fail trigger without touching the network', async () => {
    await expect(generateComparison('/fail please')).rejects.toThrow(/failure trigger/i)
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('surfaces the backend error message on a failure response', async () => {
    axios.post.mockResolvedValue({
      data: { success: false, error: 'The comparison could not be generated. Please try again.' },
    })

    await expect(generateComparison('anything')).rejects.toThrow(
      'The comparison could not be generated. Please try again.',
    )
  })

  it('reports the HTTP status when a failure response carries no message', async () => {
    axios.post.mockRejectedValue({ response: { status: 500, data: {} } })
    await expect(generateComparison('anything')).rejects.toThrow(/HTTP 500/)
  })

  it('reports an unreachable backend on network errors', async () => {
    axios.post.mockRejectedValue({ code: 'ECONNREFUSED' })
    await expect(generateComparison('anything')).rejects.toThrow(/Could not reach the backend/)
  })

  it('reports a timeout distinctly from a network failure', async () => {
    axios.post.mockRejectedValue({ code: 'ECONNABORTED' })
    await expect(generateComparison('anything')).rejects.toThrow(/timed out/i)
  })

  it('rejects unexpected payload shapes', async () => {
    axios.post.mockResolvedValue({ data: { success: true } })
    await expect(generateComparison('anything')).rejects.toThrow(/unexpected response/i)
  })
})
