import { RotateCcw, TriangleAlert } from 'lucide-react'

/** Compact error state with an optional retry action. */
export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Retry',
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-2.5 text-sm text-neutral-700">
        <TriangleAlert size={15} className="mt-0.5 shrink-0 text-neutral-500" aria-hidden="true" />
        <span className="min-w-0">
          <span className="font-medium text-neutral-900">{title}</span>
          {message && <span className="ml-1.5 break-words">{message}</span>}
        </span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:py-1.5"
        >
          <RotateCcw size={13} aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
