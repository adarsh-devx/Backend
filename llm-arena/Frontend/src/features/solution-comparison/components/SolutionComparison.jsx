import SolutionPanel from './SolutionPanel.jsx'

/**
 * Two-solution comparison: side-by-side on desktop (lg+), properly stacked
 * below — never two shrunken desktop columns on mobile.
 */
export default function SolutionComparison({ solutionA, solutionB, judge }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
      <SolutionPanel
        label="Solution A"
        provider={solutionA?.provider ?? 'Provider A'}
        content={solutionA?.content}
        score={judge?.solutionAScore}
      />
      <SolutionPanel
        label="Solution B"
        provider={solutionB?.provider ?? 'Provider B'}
        content={solutionB?.content}
        score={judge?.solutionBScore}
      />
    </div>
  )
}
