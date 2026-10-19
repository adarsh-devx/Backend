import { formatScore, isValidScore } from '../utils/winner.js'

/**
 * Score readout on a fixed 0–10 scale. Invalid/missing scores render an
 * explicit "—" with a screen-reader description — never a fabricated number.
 */
export default function ScoreDisplay({ label, score, highlight = false }) {
  const valid = isValidScore(score)
  return (
    <div
      className={`rounded-xl border bg-white p-4 ${
        highlight ? 'border-neutral-400' : 'border-neutral-200'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          {label}
        </span>
        <span className="text-xl font-semibold text-neutral-900">
          {valid ? score : '—'}
          <span className="text-sm font-normal text-neutral-400">/10</span>
        </span>
      </div>
      {!valid && <span className="sr-only">Score unavailable</span>}
      <span className="sr-only">{valid ? `Score ${formatScore(score)} out of 10` : ''}</span>
    </div>
  )
}
