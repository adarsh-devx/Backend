import { CircleHelp, Minus, Trophy } from 'lucide-react'
import { WINNER, resolveWinner, winnerLabel } from '../utils/winner.js'

/**
 * Restrained winner indicator. Never colour-only: icon + text label always
 * communicate the result, with the decision source spelled out.
 */
export default function WinnerBadge({ judge }) {
  const { winner, source } = resolveWinner(judge)

  const config = {
    [WINNER.A]: { Icon: Trophy, text: 'Solution A wins', className: 'border-neutral-900 bg-neutral-900 text-white' },
    [WINNER.B]: { Icon: Trophy, text: 'Solution B wins', className: 'border-neutral-900 bg-neutral-900 text-white' },
    [WINNER.TIE]: { Icon: Minus, text: 'Tie — no clear winner', className: 'border-neutral-300 bg-white text-neutral-700' },
    [WINNER.UNAVAILABLE]: { Icon: CircleHelp, text: 'Result unavailable', className: 'border-neutral-200 bg-neutral-50 text-neutral-500' },
  }[winner] ?? { Icon: CircleHelp, text: winnerLabel(winner), className: 'border-neutral-200 bg-neutral-50 text-neutral-500' }

  const sourceText = {
    judge: "the judge's explicit pick",
    scores: 'derived from scores (higher is better)',
    none: 'scores missing or invalid',
  }[source]

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${config.className}`}
      >
        <config.Icon size={13} aria-hidden="true" />
        {config.text}
      </span>
      <span className="text-xs text-neutral-400">{sourceText}</span>
    </span>
  )
}
