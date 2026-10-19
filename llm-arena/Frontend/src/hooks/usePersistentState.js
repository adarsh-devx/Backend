import { useEffect, useState } from 'react'
import { readJson, writeJson } from '../lib/storage.js'

/**
 * Small UI-preference state (e.g. sidebar collapsed) persisted through the
 * storage helper — components never touch LocalStorage directly, and a
 * storage failure degrades to in-memory state instead of crashing.
 */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = readJson(key, null)
    return stored === null ? initialValue : stored
  })

  useEffect(() => {
    try {
      writeJson(key, value)
    } catch {
      /* non-critical UI preference */
    }
  }, [key, value])

  return [value, setValue]
}
