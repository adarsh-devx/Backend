import CopyButton from '../../../components/ui/CopyButton.jsx'
import MarkdownRenderer from './MarkdownRenderer.jsx'
import { formatScore } from '../../judge/utils/winner.js'

/**
 * One solution panel: label, mock provider badge, score, copy action, and
 * Markdown content. Heights are natural — long content expands (no fixed
 * heights that cut off solutions).
 */
export default function SolutionPanel({ label, provider, content, score }) {
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-neutral-900">{label}</h3>
          <p className="truncate text-xs text-neutral-400" title={provider}>
            {provider}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-500">
            Score&nbsp;
            <span className="font-semibold text-neutral-900">{formatScore(score)}</span>
          </span>
          <CopyButton
            text={content ?? ''}
            label={`Copy ${label} content`}
            successMessage={`${label} content copied.`}
          />
        </div>
      </header>

      <div className="min-w-0 px-4 py-3 sm:px-5">
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </div>
    </section>
  )
}
