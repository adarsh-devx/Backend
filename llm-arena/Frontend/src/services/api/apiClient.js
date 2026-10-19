/**
 * API client placeholder for the future backend.
 *
 * The backend does not exist yet — nothing in the UI imports this module.
 * It documents the intended HTTP contract so the eventual integration is
 * mechanical (an HTTP conversation repository + a real comparison endpoint
 * replacing services/mock/comparisonService.js).
 *
 * Proposed routes (must be agreed when the backend is implemented):
 *   GET    /api/conversations
 *   GET    /api/conversations/:id
 *   POST   /api/conversations
 *   PATCH  /api/conversations/:id
 *   DELETE /api/conversations/:id
 *   POST   /api/comparisons
 *
 * The frontend must never connect directly to MongoDB; all durable storage
 * and AI-provider calls belong on the server.
 */

export const API_BASE = '/api'

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`)
  }
  return response.json()
}
