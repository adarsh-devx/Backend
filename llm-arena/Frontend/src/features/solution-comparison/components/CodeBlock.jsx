import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useClipboard } from '../../../hooks/useClipboard.js'
import { useToast } from '../../../app/providers/useToast.js'

function languageOf(node) {
  const className = node?.props?.className ?? ''
  const match = /language-(\w+)/.exec(className)
  return match ? match[1] : null
}

/**
 * Fenced code block: language label, copy (reads the rendered text, so it
 * works regardless of syntax-highlight markup), horizontal scrolling, and
 * containment inside its panel.
 */
export default function CodeBlock({ children }) {
  const copy = useClipboard()
  const { toast } = useToast()
  const preRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const childArray = Array.isArray(children) ? children : [children]
  const language = languageOf(childArray.find((child) => child?.props?.className) ?? childArray[0])

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? ''
    const succeeded = await copy(text)
    if (succeeded) {
      toast('Code copied.', { tone: 'success' })
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } else {
      toast('Clipboard unavailable — copy failed.', { tone: 'error' })
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-100/70 px-3 py-1.5">
        <span className="font-mono text-[11px] font-medium text-neutral-500">
          {language ?? 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
        </button>
      </div>
      <pre ref={preRef} className="m-0! max-w-full overflow-x-auto p-4 text-[13px] leading-6">
        {children}
      </pre>
    </div>
  )
}
