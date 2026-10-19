import { Gavel } from 'lucide-react'
import CopyButton from '../../../components/ui/CopyButton.jsx'
import MarkdownRenderer from '../../solution-comparison/components/MarkdownRenderer.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import WinnerBadge from './WinnerBadge.jsx'
import { isValidScore, verdictSummary } from '../utils/winner.js'

/**
 * Judge evaluation: both scores, judge reasoning (Markdown), and the
 * derived-or-explicit verdict. Copy actions for reasoning and verdict.
 */
export default function JudgeEvaluation({ judge }) {
  const safeJudge = judge ?? {}
  const summary = verdictSummary(judge)

  return (
    <section aria-labelledby="judge-heading" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-neutral-900 text-white">
            <Gavel size={12} aria-hidden="true" />
          </span>
          <h3 id="judge-heading" className="text-sm font-semibold tracking-tight text-neutral-900">
            Judge's evaluation
          </h3>
        </div>
        <CopyButton
          text={safeJudge.reasoning ?? ''}
          label="Copy judge reasoning"
          successMessage="Judge reasoning copied."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ScoreDisplay
          label="Solution A"
          score={safeJudge.solutionAScore}
          highlight={
            isValidScore(safeJudge.solutionAScore) &&
            isValidScore(safeJudge.solutionBScore) &&
            safeJudge.solutionAScore > safeJudge.solutionBScore
          }
        />
        <ScoreDisplay
          label="Solution B"
          score={safeJudge.solutionBScore}
          highlight={
            isValidScore(safeJudge.solutionAScore) &&
            isValidScore(safeJudge.solutionBScore) &&
            safeJudge.solutionBScore > safeJudge.solutionAScore
          }
        />
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
        <MarkdownRenderer>{safeJudge.reasoning ?? '_No judge reasoning available._'}</MarkdownRenderer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-neutral-200 pt-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
            Verdict
          </span>
          <WinnerBadge judge={judge} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{summary}</span>
          <CopyButton
            text={summary}
            label="Copy verdict"
            successMessage="Verdict copied."
          />
        </div>
      </div>
    </section>
  )
}
