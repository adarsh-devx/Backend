import { useConversations } from '../../../app/providers/useConversations.js'
import { useToast } from '../../../app/providers/useToast.js'
import { useClipboard } from '../../../hooks/useClipboard.js'
import { buildMessageMarkdown } from '../../conversation-actions/utils/export.js'
import ProblemCard from './ProblemCard.jsx'
import SolutionComparison from '../../solution-comparison/components/SolutionComparison.jsx'
import JudgeEvaluation from '../../judge/components/JudgeEvaluation.jsx'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import { MESSAGE_STATUS } from '../../../constants/index.js'

function GeneratingSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <LoadingState label="Generating two solutions and the judge's evaluation…" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className="animate-pulse rounded-2xl border border-neutral-200 p-4 sm:p-5">
            <div className="mb-4 h-4 w-24 rounded bg-neutral-100" />
            <div className="space-y-2.5">
              <div className="h-3 w-full rounded bg-neutral-100" />
              <div className="h-3 w-5/6 rounded bg-neutral-100" />
              <div className="h-3 w-2/3 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="animate-pulse rounded-2xl border border-neutral-200 p-4">
        <div className="mb-3 h-4 w-32 rounded bg-neutral-100" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="h-16 rounded-xl bg-neutral-100" />
          <div className="h-16 rounded-xl bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}

/**
 * One submitted problem: its own edit/regeneration controls and independent
 * results — never mutated by later messages.
 */
export default function MessageItem({ message }) {
  const { editProblem, retryMessage } = useConversations()
  const { toast } = useToast()
  const copy = useClipboard()

  const generating =
    message.status === MESSAGE_STATUS.PENDING || message.status === MESSAGE_STATUS.GENERATING

  const handleCopyComparison = async () => {
    const succeeded = await copy(buildMessageMarkdown(message))
    toast(succeeded ? 'Full comparison copied.' : 'Clipboard unavailable — copy failed.', {
      tone: succeeded ? 'success' : 'error',
    })
  }

  return (
    <article className="space-y-4 sm:space-y-5">
      <ProblemCard
        problem={message.problem}
        editable
        busy={generating}
        onSave={(text) => editProblem(message.id, text)}
        onCopyComparison={handleCopyComparison}
      />

      {generating && <GeneratingSkeleton />}

      {message.status === MESSAGE_STATUS.FAILED && (
        <ErrorState
          title="Generation failed."
          message={message.error}
          onRetry={() => retryMessage(message.id)}
          retryLabel="Retry"
        />
      )}

      {message.status === MESSAGE_STATUS.COMPLETED && (
        <>
          <SolutionComparison
            solutionA={message.solutionA}
            solutionB={message.solutionB}
            judge={message.judge}
          />
          <JudgeEvaluation judge={message.judge} />
        </>
      )}
    </article>
  )
}
