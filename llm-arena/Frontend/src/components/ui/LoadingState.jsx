import { LoaderCircle } from 'lucide-react'

/** Spinner + label for accessible loading announcements. */
export default function LoadingState({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" aria-live="polite" className={`flex items-center gap-2.5 text-sm text-neutral-500 ${className}`}>
      <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}
