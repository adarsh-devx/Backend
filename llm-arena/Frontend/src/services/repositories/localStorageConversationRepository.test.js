import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createLocalStorageConversationRepository } from './localStorageConversationRepository.js'
import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_CONVERSATION_TITLE } from '../../constants/index.js'

beforeEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe('listConversations', () => {
  it('returns an empty list when nothing is stored', async () => {
    const repository = createLocalStorageConversationRepository()
    await expect(repository.listConversations()).resolves.toEqual([])
  })

  it('returns conversations sorted by updatedAt descending', async () => {
    const repository = createLocalStorageConversationRepository()
    const older = await repository.createConversation({ title: 'Older' })
    const newer = await repository.createConversation({ title: 'Newer' })
    await new Promise((resolve) => setTimeout(resolve, 5))
    await repository.updateConversation(older.id, { title: 'Older (touched)' })

    const list = await repository.listConversations()
    expect(list.map((entry) => entry.title)).toEqual(['Older (touched)', 'Newer'])
    expect(newer.id).toBeTruthy()
  })
})

describe('createConversation', () => {
  it('creates a valid conversation document', async () => {
    const repository = createLocalStorageConversationRepository()
    const conversation = await repository.createConversation({ title: 'First' })

    expect(conversation.id).toBeTruthy()
    expect(conversation.title).toBe('First')
    expect(conversation.messages).toEqual([])
    expect(conversation.archivedAt).toBeNull()
    expect(() => new Date(conversation.createdAt).toISOString()).not.toThrow()
    expect(conversation.createdAt).toBe(conversation.updatedAt)
  })

  it('uses the default title when none is given', async () => {
    const repository = createLocalStorageConversationRepository()
    const conversation = await repository.createConversation()
    expect(conversation.title).toBe(DEFAULT_CONVERSATION_TITLE)
  })
})

describe('updateConversation / saveConversation / deleteConversation', () => {
  it('updates a title and bumps updatedAt', async () => {
    const repository = createLocalStorageConversationRepository()
    const conversation = await repository.createConversation({ title: 'Before' })
    await new Promise((resolve) => setTimeout(resolve, 5))
    const updated = await repository.updateConversation(conversation.id, { title: 'After' })

    expect(updated.title).toBe('After')
    expect(updated.id).toBe(conversation.id)
    expect(updated.updatedAt >= conversation.updatedAt).toBe(true)
  })

  it('throws when updating a missing conversation', async () => {
    const repository = createLocalStorageConversationRepository()
    await expect(repository.updateConversation('nope', { title: 'x' })).rejects.toThrow(
      'not found',
    )
  })

  it('persists messages through saveConversation and reloads them', async () => {
    const repository = createLocalStorageConversationRepository()
    const conversation = await repository.createConversation({ title: 'With messages' })
    const withMessage = {
      ...conversation,
      messages: [
        {
          id: 'msg-1',
          problem: 'A problem',
          solutionA: null,
          solutionB: null,
          judge: null,
          status: 'generating',
          error: null,
          createdAt: new Date().toISOString(),
        },
      ],
    }
    await repository.saveConversation(withMessage)

    const fresh = createLocalStorageConversationRepository()
    const reloaded = await fresh.getConversationById(conversation.id)
    expect(reloaded.messages).toHaveLength(1)
    expect(reloaded.messages[0].problem).toBe('A problem')
  })

  it('refuses to persist invalid conversations', async () => {
    const repository = createLocalStorageConversationRepository()
    await expect(repository.saveConversation({ bogus: true })).rejects.toThrow('invalid')
  })

  it('deletes conversations and reports misses', async () => {
    const repository = createLocalStorageConversationRepository()
    const conversation = await repository.createConversation({ title: 'Doomed' })

    expect(await repository.deleteConversation(conversation.id)).toBe(true)
    expect(await repository.getConversationById(conversation.id)).toBeNull()
    expect(await repository.deleteConversation(conversation.id)).toBe(false)
  })
})

describe('malformed and hostile storage data', () => {
  it('recovers from corrupt JSON without crashing', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    window.localStorage.setItem(STORAGE_KEY, '{ not json !!!')

    const repository = createLocalStorageConversationRepository()
    await expect(repository.listConversations()).resolves.toEqual([])
    // Corrupt payload is quarantined; the store starts clean.
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(`${STORAGE_KEY}.corrupt`)).toBe('{ not json !!!')
  })

  it('ignores entries that do not match the conversation shape', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        conversations: [null, 42, { id: 'ok', title: 'Valid', createdAt: 'x', updatedAt: 'x', archivedAt: null, messages: [] }, { title: 'No id' }],
      }),
    )

    const repository = createLocalStorageConversationRepository()
    const list = await repository.listConversations()
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe('ok')
  })

  it('starts clean for unknown storage versions', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 999, conversations: [{ id: 'x', title: 'x', messages: [] }] }),
    )

    const repository = createLocalStorageConversationRepository()
    await expect(repository.listConversations()).resolves.toEqual([])
  })
})

describe('storage failure handling', () => {
  it('rejects instead of silently losing data when writes fail', async () => {
    const repository = createLocalStorageConversationRepository()
    const conversation = await repository.createConversation({ title: 'Persisted' })

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    await expect(
      repository.saveConversation({ ...conversation, title: 'Changed' }),
    ).rejects.toThrow('Could not save changes to local storage.')
  })

  it('returns an empty list (not a crash) when reads fail', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    const repository = createLocalStorageConversationRepository()
    await expect(repository.listConversations()).resolves.toEqual([])
  })
})
