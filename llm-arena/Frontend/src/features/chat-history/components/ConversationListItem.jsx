import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useConversations } from '../../../app/providers/useConversations.js'
import { formatRelativeTime } from '../utils/time.js'
import { DEFAULT_CONVERSATION_TITLE } from '../../../constants/index.js'

/**
 * One conversation row: open, inline rename (Enter saves, Escape cancels,
 * empty titles rejected with an associated message), and delete request.
 * Actions are always visible — never hidden behind hover-only states.
 */
export default function ConversationListItem({ conversation, isActive, onSelect, onRequestDelete }) {
  const { renameConversation } = useConversations()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(conversation.title)
  const [error, setError] = useState(null)

  const startEditing = () => {
    setDraft(conversation.title)
    setError(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setError(null)
  }

  const saveEditing = async () => {
    const result = await renameConversation(conversation.id, draft)
    if (!result.ok) {
      setError(result.reason === 'empty' ? 'Title cannot be empty.' : 'Rename failed.')
      return
    }
    setEditing(false)
    setError(null)
  }

  const label = conversation.title || DEFAULT_CONVERSATION_TITLE

  return (
    <li>
      {editing ? (
        <div className="px-1 py-1">
          <input
            autoFocus
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                saveEditing()
              } else if (event.key === 'Escape') {
                event.preventDefault()
                cancelEditing()
              }
            }}
            onBlur={() => {
              if (!error) cancelEditing()
            }}
            aria-label={`Rename conversation "${label}"`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `rename-error-${conversation.id}` : undefined}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-900"
          />
          {error && (
            <p id={`rename-error-${conversation.id}`} role="alert" className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center gap-1 rounded-lg pr-1 transition-colors ${
            isActive ? 'bg-neutral-100' : 'hover:bg-neutral-50'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(conversation.id)}
            aria-current={isActive ? 'page' : undefined}
            className="min-w-0 flex-1 px-2 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <span className="block truncate text-sm font-medium text-neutral-800">{label}</span>
            <span className="block text-xs text-neutral-400">
              {formatRelativeTime(conversation.updatedAt)}
              {conversation.messages.length > 0 && ` · ${conversation.messages.length} problem${conversation.messages.length === 1 ? '' : 's'}`}
            </span>
          </button>
          <span className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={startEditing}
              aria-label={`Rename conversation "${label}"`}
              className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <Pencil size={13} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete(conversation)}
              aria-label={`Delete conversation "${label}"`}
              className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          </span>
        </div>
      )}
    </li>
  )
}
