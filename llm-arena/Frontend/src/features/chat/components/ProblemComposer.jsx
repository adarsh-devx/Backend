import { useEffect, useRef } from 'react'
import { ArrowUp, LoaderCircle } from 'lucide-react'
import { MAX_PROBLEM_LENGTH } from '../../../constants/index.js'

/**
 * Problem composer (welcome + conversation footer variants).
 * Multiline autosize, Enter submits, Shift+Enter newlines, disabled for
 * empty/whitespace input or while generating, character counter. It never
 * clears its own value — callers clear it only after a successful submit,
 * so failed submissions preserve the user's text.
 */
export default function ProblemComposer({
  value,
  onChange,
  onSubmit,
  busy = false,
  variant = 'chat',
  id = 'problem-composer',
}) {
  const textareaRef = useRef(null)
  const isWelcome = variant === 'welcome'
  const canSubmit = !busy && value.trim().length > 0

  useEffect(() => {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, isWelcome ? 200 : 168)}px`
  }, [value, isWelcome])

  const submit = () => {
    if (canSubmit) onSubmit(value)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className="w-full"
    >
      <div
        className={`flex items-end gap-2 rounded-2xl border bg-white shadow-sm transition-colors focus-within:border-neutral-400 ${
          isWelcome ? 'border-neutral-300 p-2.5' : 'border-neutral-200 p-2'
        }`}
      >
        <label htmlFor={id} className="sr-only">
          Describe your problem
        </label>
        <textarea
          id={id}
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_PROBLEM_LENGTH}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              submit()
            }
          }}
          placeholder="Describe a problem — the judge compares two solutions…"
          className={`min-h-16 sm:min-h-12 flex-1 resize-none bg-transparent px-2 leading-6 text-neutral-900 outline-none placeholder:text-neutral-400 ${
            isWelcome ? 'py-1.5 text-base' : 'py-1.5 text-base sm:text-[15px]'
          }`}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Submit problem"
          className={`flex shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-all hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 ${
            isWelcome ? 'size-10' : 'size-10 sm:size-9'
          }`}
        >
          {busy ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowUp size={16} strokeWidth={2.5} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[10px]">
            Enter
          </kbd>{' '}
          to send ·{' '}
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[10px]">
            Shift + Enter
          </kbd>{' '}
          for a new line
        </p>
        <p className="shrink-0 text-xs text-neutral-400">
          <span className={value.length >= MAX_PROBLEM_LENGTH ? 'text-neutral-600' : undefined}>
            {value.length}
          </span>
          /{MAX_PROBLEM_LENGTH}
        </p>
      </div>
    </form>
  )
}
