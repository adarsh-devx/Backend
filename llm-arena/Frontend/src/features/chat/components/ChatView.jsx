import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, FileJson } from 'lucide-react'
import { useConversations } from '../../../app/providers/useConversations.js'
import { useToast } from '../../../app/providers/useToast.js'
import WelcomeScreen from './WelcomeScreen.jsx'
import MessageItem from './MessageItem.jsx'
import ProblemComposer from './ProblemComposer.jsx'
import { formatRelativeTime } from '../../chat-history/utils/time.js'
import {
  buildConversationJSON,
  buildConversationMarkdown,
  conversationFilename,
  downloadTextFile,
} from '../../conversation-actions/utils/export.js'

/**
 * Conversation area: welcome state (no conversation) or active conversation
 * with toolbar (title + export), message list, and a footer composer that
 * stays in flow — never covering content.
 */
export default function ChatView({ conversation }) {
  const { submitProblem, isGeneratingActive } = useConversations()
  const { toast } = useToast()
  const [draft, setDraft] = useState('')
  const mainRef = useRef(null)

  const messageCount = conversation?.messages.length ?? 0
  const lastStatus = conversation?.messages.at(-1)?.status ?? null
  const conversationRef = useRef(conversation)
  useEffect(() => {
    conversationRef.current = conversation
  }, [conversation])

  // Follow new messages/results without jumping when nothing changes.
  useEffect(() => {
    const element = mainRef.current
    if (!element || !conversationRef.current) return
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
  }, [messageCount, lastStatus])

  const handleSubmit = async (text) => {
    const result = await submitProblem(text)
    if (result.ok) setDraft('') // preserve text when submission fails
    return result
  }

  const handleUseExample = (prompt) => setDraft(prompt)

  const exportTargets = useMemo(() => {
    if (!conversation) return null
    return {
      markdown: () => {
        try {
          downloadTextFile(
            conversationFilename(conversation.title, 'md'),
            buildConversationMarkdown(conversation),
            'text/markdown;charset=utf-8',
          )
          toast('Conversation exported as Markdown.', { tone: 'success' })
        } catch {
          toast('Markdown export failed.', { tone: 'error' })
        }
      },
      json: () => {
        try {
          downloadTextFile(
            conversationFilename(conversation.title, 'json'),
            buildConversationJSON(conversation),
            'application/json',
          )
          toast('Conversation exported as JSON.', { tone: 'success' })
        } catch {
          toast('JSON export failed.', { tone: 'error' })
        }
      },
    }
  }, [conversation, toast])

  if (!conversation) {
    return (
      <main className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <WelcomeScreen
          value={draft}
          onChange={setDraft}
          onSubmit={handleSubmit}
          busy={false}
          onUseExample={handleUseExample}
        />
      </main>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-neutral-100 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 sm:px-6 xl:max-w-6xl">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-neutral-900" title={conversation.title}>
              {conversation.title}
            </h2>
            <p className="text-xs text-neutral-400">
              Updated {formatRelativeTime(conversation.updatedAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={exportTargets.markdown}
              aria-label="Export conversation as Markdown"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <Download size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Export MD</span>
            </button>
            <button
              type="button"
              onClick={exportTargets.json}
              aria-label="Export conversation as JSON"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <FileJson size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      <main ref={mainRef} className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8 xl:max-w-6xl">
          {conversation.messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </main>

      <footer className="shrink-0 border-t border-neutral-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6 sm:py-4 xl:max-w-6xl">
          <ProblemComposer
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            busy={isGeneratingActive}
          />
        </div>
      </footer>
    </div>
  )
}
