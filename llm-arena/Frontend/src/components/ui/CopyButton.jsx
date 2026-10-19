import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard.js'
import { useToast } from '../../app/providers/useToast.js'

/**
 * Copy-to-clipboard button with temporary check feedback and a toast on both
 * success and failure (clipboard errors are never silent).
 */
export default function CopyButton({
  text,
  label = 'Copy',
  showLabel = false,
  className = '',
  successMessage = 'Copied to clipboard',
}) {
  const copy = useClipboard()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const resetTimerRef = useRef(null)

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    },
    [],
  )

  const handleClick = async () => {
    const succeeded = await copy(text)
    if (succeeded) {
      toast(successMessage, { tone: 'success' })
      setCopied(true)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => setCopied(false), 1600)
    } else {
      toast('Clipboard unavailable — copy failed.', { tone: 'error' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={showLabel ? undefined : `${label} — ${copied ? 'copied' : 'copy to clipboard'}`}
      title={label}
      className={`flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${className}`}
    >
      {copied ? (
        <Check size={13} className="text-neutral-500" aria-hidden="true" />
      ) : (
        <Copy size={13} aria-hidden="true" />
      )}
      {showLabel && <span>{copied ? 'Copied' : label}</span>}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </button>
  )
}
