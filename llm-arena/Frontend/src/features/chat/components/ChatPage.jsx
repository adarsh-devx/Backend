import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useConversations } from '../../../app/providers/useConversations.js'
import ChatView from './ChatView.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import { MessageSquare } from 'lucide-react'

/**
 * Route entry for "/" (welcome/new chat) and "/c/:conversationId" (existing
 * conversation). Syncs the URL with the store so history selection,
 * deep links, and reloads all resolve to the same conversation.
 */
export default function ChatPage() {
  const { conversationId } = useParams()
  const { setActiveId, activeConversation, loadStatus, loadError, reload, newChat } =
    useConversations()

  useEffect(() => {
    setActiveId(conversationId ?? null)
  }, [conversationId, setActiveId])

  if (loadStatus === 'loading') {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <LoadingState label="Loading conversations…" />
      </div>
    )
  }

  if (loadStatus === 'error') {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <ErrorState
          title="Couldn't load conversations."
          message={loadError}
          onRetry={reload}
          retryLabel="Try again"
        />
      </div>
    )
  }

  if (!conversationId) {
    return <ChatView key="new" conversation={null} />
  }

  if (!activeConversation) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <EmptyState
          icon={MessageSquare}
          title="Conversation not found"
          description="It may have been deleted, or the link is invalid."
        >
          <button
            type="button"
            onClick={newChat}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Start a new chat
          </button>
        </EmptyState>
      </div>
    )
  }

  return <ChatView key={conversationId} conversation={activeConversation} />
}
