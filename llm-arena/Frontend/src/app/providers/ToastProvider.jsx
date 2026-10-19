import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { ToastContext } from './toastContext.js'

const TONE_STYLES = {
  success: {
    className: 'border-neutral-200 text-neutral-900',
    Icon: CheckCircle2,
    iconClass: 'text-neutral-500',
  },
  error: {
    className: 'border-red-200 text-red-900',
    Icon: AlertCircle,
    iconClass: 'text-red-600',
  },
  info: {
    className: 'border-neutral-200 text-neutral-700',
    Icon: Info,
    iconClass: 'text-neutral-500',
  },
}

const TOAST_DURATION_MS = 3200

/**
 * Lightweight toast notifications. Rendered inside a polite live region so
 * screen readers announce copy/export/save feedback; tone is communicated by
 * icon + text, never colour alone.
 */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())
  const nextIdRef = useRef(1)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message, { tone = 'info' } = {}) => {
      const id = nextIdRef.current
      nextIdRef.current += 1
      setToasts((current) => [...current, { id, message, tone }])
      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), TOAST_DURATION_MS),
      )
    },
    [dismiss],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map(({ id, message, tone }) => {
          const { className, Icon, iconClass } = TONE_STYLES[tone] ?? TONE_STYLES.info
          return (
            <div
              key={id}
              role="status"
              className={`pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-md ${className}`}
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} aria-hidden="true" />
              <span className="leading-5">{message}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
