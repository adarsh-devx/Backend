import { createContext } from 'react'

/**
 * Shared conversation store: list, active selection, lifecycle status, and
 * all conversation/message actions.
 */
export const ConversationsContext = createContext(null)
