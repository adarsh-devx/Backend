/**
 * Thin, safe LocalStorage helpers.
 *
 * Components never import this directly — repositories and hooks do — so the
 * storage mechanism stays behind an interface that a future HTTP repository
 * can replace.
 */

/**
 * Read and parse a JSON value. Returns `fallback` when the key is missing,
 * the payload is malformed, or storage itself is unavailable. A malformed
 * payload is quarantined under `<key>.corrupt` (best effort) so one bad write
 * can never crash the app or destroy diagnostics.
 */
export function readJson(key, fallback = null) {
  let raw
  try {
    raw = window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`[storage] unable to read "${key}"`, error)
    return fallback
  }

  if (raw === null || raw === undefined || raw === '') return fallback

  try {
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`[storage] malformed data under "${key}", quarantining`, error)
    try {
      window.localStorage.setItem(`${key}.corrupt`, raw)
      window.localStorage.removeItem(key)
    } catch {
      /* quarantine is best-effort */
    }
    return fallback
  }
}

/**
 * Serialize and persist a JSON value. Throws on quota/security errors so the
 * repository layer can surface a persistence error to the caller instead of
 * silently losing data.
 */
export function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/** Remove a key. Swallows missing-key errors; rethrows storage failures. */
export function removeKey(key) {
  window.localStorage.removeItem(key)
}
