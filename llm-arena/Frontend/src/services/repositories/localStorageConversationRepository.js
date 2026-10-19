import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_CONVERSATION_TITLE } from '../../constants/index.js'
import { readJson, writeJson } from '../../lib/storage.js'

/**
 * LocalStorage-backed conversation repository.
 *
 * Implements the repository interface documented in ./index.js. Every method
 * is asynchronous so the UI is already written against Promise semantics —
 * replacing this file with an HTTP-backed repository later requires no
 * component changes.
 *
 * Read failures and malformed data degrade to an empty list (the app never
 * crashes on bad storage); write failures reject so the caller can surface a
 * persistence error instead of silently losing data.
 */

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `conv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function nowIso() {
  return new Date().toISOString()
}

function isStoredMessage(message) {
  return (
    message &&
    typeof message === 'object' &&
    typeof message.id === 'string' &&
    typeof message.problem === 'string'
  )
}

function isStoredConversation(conversation) {
  return (
    conversation &&
    typeof conversation === 'object' &&
    typeof conversation.id === 'string' &&
    typeof conversation.title === 'string' &&
    Array.isArray(conversation.messages)
  )
}

/**
 * Validate and normalise whatever was stored. Unknown/corrupt entries are
 * dropped rather than trusted; missing optional fields get safe defaults.
 * Includes a simple version gate (future versions get a migration hook).
 */
function normalizeState(raw) {
  const empty = { version: STORAGE_VERSION, conversations: [] }

  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.conversations)) return empty
  if (raw.version !== STORAGE_VERSION) {
    // Future: migrate older versions here. Unknown versions start clean.
    return empty
  }

  return {
    version: STORAGE_VERSION,
    conversations: raw.conversations.filter(isStoredConversation).map((conversation) => ({
      id: conversation.id,
      title: conversation.title || DEFAULT_CONVERSATION_TITLE,
      createdAt: conversation.createdAt || nowIso(),
      updatedAt: conversation.updatedAt || conversation.createdAt || nowIso(),
      archivedAt: conversation.archivedAt ?? null,
      messages: conversation.messages.filter(isStoredMessage),
    })),
  }
}

function notFoundError(id) {
  return new Error(`Conversation not found: ${id}`)
}

function persistenceError(cause) {
  const error = new Error('Could not save changes to local storage.')
  error.cause = cause
  return error
}

export function createLocalStorageConversationRepository() {
  function load() {
    return normalizeState(readJson(STORAGE_KEY, null))
  }

  function persist(state) {
    try {
      writeJson(STORAGE_KEY, state)
    } catch (error) {
      throw persistenceError(error)
    }
  }

  function sortConversations(conversations) {
    // Descending updatedAt; equal timestamps keep their stable insertion order.
    return [...conversations].sort((a, b) => {
      if (a.updatedAt === b.updatedAt) return 0
      return a.updatedAt < b.updatedAt ? 1 : -1
    })
  }

  return {
    async listConversations() {
      await null
      return sortConversations(load().conversations)
    },

    async getConversationById(id) {
      await null
      return load().conversations.find((conversation) => conversation.id === id) ?? null
    },

    async createConversation({ title = DEFAULT_CONVERSATION_TITLE } = {}) {
      await null
      const state = load()
      const timestamp = nowIso()
      const conversation = {
        id: createId(),
        title,
        createdAt: timestamp,
        updatedAt: timestamp,
        archivedAt: null,
        messages: [],
      }
      state.conversations.push(conversation)
      persist(state)
      return conversation
    },

    async updateConversation(id, changes) {
      await null
      const state = load()
      const index = state.conversations.findIndex((conversation) => conversation.id === id)
      if (index === -1) throw notFoundError(id)

      const updated = {
        ...state.conversations[index],
        ...changes,
        id, // id is immutable through updates
        updatedAt: nowIso(),
      }
      state.conversations[index] = updated
      persist(state)
      return updated
    },

    async saveConversation(conversation) {
      await null
      if (!isStoredConversation(conversation)) {
        throw new Error('Refusing to persist an invalid conversation.')
      }
      const state = load()
      const saved = { ...conversation, updatedAt: nowIso() }
      const index = state.conversations.findIndex((entry) => entry.id === conversation.id)
      if (index === -1) state.conversations.push(saved)
      else state.conversations[index] = saved
      persist(state)
      return saved
    },

    async deleteConversation(id) {
      await null
      const state = load()
      const next = state.conversations.filter((conversation) => conversation.id !== id)
      if (next.length === state.conversations.length) return false
      state.conversations = next
      persist(state)
      return true
    },
  }
}
