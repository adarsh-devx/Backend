import { createLocalStorageConversationRepository } from './localStorageConversationRepository.js'

/**
 * Conversation repository — the single persistence boundary of the app.
 *
 * Components and hooks use this module only; they never touch LocalStorage
 * directly. The interface (all methods return Promises):
 *
 *   listConversations(): Promise<Conversation[]>          // updatedAt desc
 *   getConversationById(id): Promise<Conversation | null>
 *   createConversation({ title }): Promise<Conversation>
 *   updateConversation(id, changes): Promise<Conversation> // throws if missing
 *   saveConversation(conversation): Promise<Conversation>  // full replace/upsert
 *   deleteConversation(id): Promise<boolean>
 *
 * Replacing LocalStorage with the future backend
 * -------------------------------------------------
 * When the Node.js/Express + MongoDB backend exists, swap the export below
 * for an HTTP implementation with the same method signatures calling:
 *
 *   GET    /api/conversations
 *   GET    /api/conversations/:id
 *   POST   /api/conversations
 *   PATCH  /api/conversations/:id
 *   DELETE /api/conversations/:id
 *   POST   /api/comparisons            (replaces services/mock)
 *
 * NOTE: these routes are proposed examples, not existing endpoints — the
 * final contract must be agreed when the backend is implemented. No UI code
 * changes, because callers only depend on the Promise contract above.
 */
export const conversationRepository = createLocalStorageConversationRepository()
