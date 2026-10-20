import { MessageSquare } from 'lucide-react'
import ProblemComposer from './ProblemComposer.jsx'
import { EXAMPLE_PROMPTS } from '../../../constants/index.js'

/**
 * Welcome/empty state: heading, description, prominent composer, and a few
 * example prompts that populate (not auto-send) the composer.
 */
export default function WelcomeScreen({ value, onChange, onSubmit, busy, onUseExample }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-500">
            <MessageSquare size={18} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            Find the better solution.
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-neutral-500 sm:text-base">
            Describe a problem, compare two AI-generated solutions side by side, and read the
            judge's evaluation and verdict.
          </p>
        </div>

        <div className="mt-6">
          <ProblemComposer
            id="welcome-composer"
            variant="welcome"
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            busy={busy}
          />
        </div>

        <div className="mt-5">
          <p className="text-center text-xs font-medium tracking-wide text-neutral-400 uppercase">
            Try an example
          </p>
          <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onUseExample(prompt)}
                className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-left text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:max-w-[18rem] sm:truncate"
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
