import { MessageSquare } from 'lucide-react'
import ProblemComposer from './ProblemComposer.jsx'
import { EXAMPLE_PROMPTS } from '../../../constants/index.js'

/**
 * Welcome/empty state: heading, description, prominent composer, and a few
 * example prompts that populate (not auto-send) the composer.
 */
export default function WelcomeScreen({ value, onChange, onSubmit, busy, onUseExample }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-500">
            <MessageSquare size={19} aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Find the better solution.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-neutral-500 sm:text-lg">
            Describe a problem, compare two mock solutions side by side, and read the judge's
            evaluation and verdict.
          </p>
        </div>

        <div className="mt-9">
          <ProblemComposer
            id="welcome-composer"
            variant="welcome"
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            busy={busy}
          />
        </div>

        <div className="mt-8">
          <p className="text-center text-xs font-medium tracking-wide text-neutral-400 uppercase">
            Try an example
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onUseExample(prompt)}
                className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-left text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:max-w-[18rem] sm:truncate"
                title={prompt}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
