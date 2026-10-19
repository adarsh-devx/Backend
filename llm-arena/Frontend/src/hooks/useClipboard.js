import { useCallback } from 'react'

/**
 * Copy text with the Clipboard API and a legacy fallback.
 * Resolves `true` on success, `false` when neither path works — callers
 * surface the result as a toast so clipboard failures are never silent.
 */
export function useClipboard() {
  return useCallback(async (text) => {
    const value = String(text ?? '')
    if (!value) return false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        return true
      }
    } catch {
      /* fall through to the legacy path */
    }

    try {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const succeeded = document.execCommand('copy')
      textarea.remove()
      return succeeded
    } catch {
      return false
    }
  }, [])
}
