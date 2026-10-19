import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'

/**
 * The submitted problem: right-aligned bubble with Edit + Copy-comparison
 * actions, and an inline editor that regenerates on save (stale results are
 * invalidated by the store before regeneration starts).
 */
export default function ProblemCard({
  problem,
  editable = false,
  busy = false,
  onSave,
  onCopyComparison,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(problem)
  const [error, setError] = useState(null)

  const startEditing = () => {
    setDraft(problem)
    setError(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setError(null)
  }

  const saveEditing = () => {
    const result = onSave(draft)
    if (!result.ok) {
      if (result.reason === 'empty') setError('Problem cannot be empty.')
      else if (result.reason === 'unchanged') cancelEditing()
      else setError('Could not save the problem.')
      return
    }
    setEditing(false)
    setError(null)
  }

  if (editing) {
    return (
      <div className="flex justify-end">
        <div className="w-full max-w-2xl rounded-2xl border border-neutral-300 bg-white p-3 shadow-sm">
          <label htmlFor="edit-problem" className="sr-only">
            Edit your problem
          </label>
          <textarea
            id="edit-problem"
            autoFocus
            value={draft}
            rows={3}
            onChange={(event) => {
              setDraft(event.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                saveEditing()
              } else if (event.key === 'Escape') {
                event.preventDefault()
                cancelEditing()
              }
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'edit-problem-error' : undefined}
            className="w-full resize-y bg-transparent px-1 py-1 text-[15px] leading-7 text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          {error && (
            <p id="edit-problem-error" role="alert" className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400">
              Saving regenerates both solutions and the evaluation.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <X size={13} aria-hidden="true" />
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEditing}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <Check size={13} aria-hidden="true" />
                Save & regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="max-w-[85%] rounded-2xl bg-neutral-100 px-4 py-2.5 text-[15px] leading-7 break-words whitespace-pre-wrap text-neutral-800 md:max-w-[75%]">
        {problem}
      </div>
      <div className="flex items-center gap-1">
        {onCopyComparison && (
          <button
            type="button"
            onClick={onCopyComparison}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Copy comparison
          </button>
        )}
        {editable && (
          <button
            type="button"
            onClick={startEditing}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={12} aria-hidden="true" />
            Edit
          </button>
        )}
      </div>
    </div>
  )
}
