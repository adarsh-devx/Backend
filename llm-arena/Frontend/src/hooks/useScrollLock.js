import { useEffect } from 'react'

/** Lock background scrolling while an overlay (drawer/dialog) is open. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
