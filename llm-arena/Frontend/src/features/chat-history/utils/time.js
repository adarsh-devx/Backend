/**
 * Timestamp formatting for sidebar metadata and export headers.
 * All functions accept injectable values so tests stay deterministic.
 */

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function parse(iso) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/** e.g. "just now", "5m ago", "3h ago", "2d ago", "Oct 12, 2026". */
export function formatRelativeTime(iso, now = Date.now()) {
  const date = parse(iso)
  if (!date) return '—'

  const diff = Math.max(0, now - date.getTime())
  if (diff < MINUTE) return 'just now'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d ago`
  return dateFormatter.format(date)
}

/** e.g. "Oct 12, 2026, 2:05 PM" — used in export headers. */
export function formatDateTime(iso) {
  const date = parse(iso)
  if (!date) return 'unknown'
  return dateTimeFormatter.format(date)
}
