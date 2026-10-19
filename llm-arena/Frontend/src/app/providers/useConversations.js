import { useContext } from 'react'
import { ConversationsContext } from './conversationsContext.js'

/** Access the conversation store. */
export function useConversations() {
  const context = useContext(ConversationsContext)
  if (!context) {
    throw new Error('useConversations must be used within a ConversationsProvider')
  }
  return context
}
