import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Plus } from 'lucide-react'
import { useConversations } from '../../../app/providers/useConversations.js'
import { useToast } from '../../../app/providers/useToast.js'
import ConversationListItem from './ConversationListItem.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog.jsx'

/**
 * Shared history panel used by the desktop sidebar and the mobile drawer:
 * New Chat, recent conversations, inline rename, and confirmed deletion.
 */
export default function ConversationListPanel({ onAfterSelect }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { conversations, activeId, deleteConversation, newChat } = useConversations()
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleNewChat = () => {
    newChat()
    onAfterSelect?.()
  }

  const handleSelect = (conversationId) => {
    navigate(`/c/${conversationId}`)
    onAfterSelect?.()
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    const succeeded = await deleteConversation(pendingDelete.id)
    setDeleting(false)
    setPendingDelete(null)
    if (succeeded) toast('Conversation deleted.', { tone: 'success' })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="p-3">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          <Plus size={15} aria-hidden="true" />
          New Chat
        </button>
      </div>

      <p className="px-4 pb-1 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
        Recent conversations
      </p>

      <ul className="chat-scroll min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Problems you submit show up here with their comparisons."
          />
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeId}
              onSelect={handleSelect}
              onRequestDelete={setPendingDelete}
            />
          ))
        )}
      </ul>

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        title="Delete conversation?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” and all of its messages will be permanently removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) setPendingDelete(null)
        }}
      />
    </div>
  )
}
