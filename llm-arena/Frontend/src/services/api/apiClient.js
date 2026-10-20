import axios from 'axios'
import { MOCK_FAILURE_PREFIX } from '../../constants/index.js'

/**
 * Real backend client — the comparison service used by the app.
 *
 * Talks to the Node/Express backend (`../Backend`) via `POST /invoke`:
 *   request:  { input: <problem statement> }
 *   response: { success: true, result: { problem, solution_1, solution_1_provider,
 *               solution_2, solution_2_provider,
 *               judge: { solution_1_score, solution_2_score,
 *                        solution_1_reasoning, solution_2_reasoning } } }
 *   failure:  { success: false, error: <message> }  (400/502)
 *
 * The backend's snake_case shape is mapped here to the UI data model so no
 * component ever sees backend field names:
 *   { solutionA: { content, provider },
 *     solutionB: { content, provider },
 *     judge: { solutionAScore, solutionBScore, reasoning, recommendedSolution } }
 *
 * Base URL: `VITE_API_BASE_URL` env var (no trailing slash), defaulting to the
 * local dev backend. CORS is enabled on the backend for the Vite origin.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

/** LLM calls are slow (2–3 min observed): fail with a clear message rather than hanging forever. */
const REQUEST_TIMEOUT_MS = 300_000

/** Used only when an older backend omits provider labels. */
const FALLBACK_PROVIDER_A = 'Provider A'
const FALLBACK_PROVIDER_B = 'Provider B'

function toScore(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/** Merge the judge's two per-solution reasonings into one Markdown block. */
function buildReasoning(judge) {
  const parts = []
  if (judge?.solution_1_reasoning) {
    parts.push(`**Solution A** — ${judge.solution_1_reasoning}`)
  }
  if (judge?.solution_2_reasoning) {
    parts.push(`**Solution B** — ${judge.solution_2_reasoning}`)
  }
  return parts.join('\n\n')
}

/**
 * Map one raw backend `result` onto the UI data model. Pure and exported so
 * the contract is unit-testable without a server.
 *
 * `recommendedSolution` stays null: the backend judge only emits scores, so
 * the winner util derives it from the scores (labelled "higher score" rather
 * than a judge's pick — provenance stays honest).
 */
export function mapComparisonResult(result) {
  const judge = result?.judge
  return {
    solutionA: {
      content: typeof result?.solution_1 === 'string' ? result.solution_1 : '',
      provider: result?.solution_1_provider || FALLBACK_PROVIDER_A,
    },
    solutionB: {
      content: typeof result?.solution_2 === 'string' ? result.solution_2 : '',
      provider: result?.solution_2_provider || FALLBACK_PROVIDER_B,
    },
    judge: {
      solutionAScore: toScore(judge?.solution_1_score),
      solutionBScore: toScore(judge?.solution_2_score),
      reasoning: buildReasoning(judge),
      recommendedSolution: null,
    },
  }
}

/** Translate axios failures into messages safe to show in the UI. */
function describeRequestError(error) {
  if (error?.response) {
    const serverMessage = error.response.data?.error
    if (typeof serverMessage === 'string' && serverMessage) return serverMessage
    return `The backend responded with HTTP ${error.response.status}.`
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The comparison timed out — the models took too long. Please retry.'
  }
  return `Could not reach the backend at ${API_BASE_URL} — is it running, or did it block this origin (CORS)?`
}

/**
 * Generate a two-solution comparison for a problem. Resolves to the UI data
 * model documented above; rejects with a user-presentable message on
 * validation, network, or backend failures.
 */
export async function generateComparison(problem) {
  const trimmed = String(problem ?? '').trim()
  if (!trimmed) {
    throw new Error('Please describe a problem before sending.')
  }
  // Deterministic failure trigger (same convention as the mock service) so
  // error/retry states stay demonstrable without breaking the backend.
  if (trimmed.toLowerCase().startsWith(MOCK_FAILURE_PREFIX)) {
    throw new Error(
      `Generation failed (failure trigger "${MOCK_FAILURE_PREFIX}"). Remove the prefix and retry.`,
    )
  }

  let response
  try {
    response = await axios.post(
      `${API_BASE_URL}/invoke`,
      { input: trimmed },
      { timeout: REQUEST_TIMEOUT_MS },
    )
  } catch (error) {
    throw new Error(describeRequestError(error), { cause: error })
  }

  const payload = response?.data
  if (typeof payload?.error === 'string' && payload.error) {
    throw new Error(payload.error)
  }
  if (!payload?.success || !payload.result) {
    throw new Error('The backend returned an unexpected response. Please try again.')
  }

  return mapComparisonResult(payload.result)
}
