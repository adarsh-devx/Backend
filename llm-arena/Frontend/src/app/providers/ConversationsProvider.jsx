import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConversationsContext } from './conversationsContext.js'
import { useToast } from './useToast.js'
import { conversationRepository } from '../../services/repositories/index.js'
import { generateComparison } from '../../services/mock/comparisonService.js'
import { titleFromProblem } from '../../features/chat-history/utils/title.js'
import { createId } from '../../lib/id.js'
import { MAX_PROBLEM_LENGTH, MESSAGE_STATUS } from '../../constants/index.js'

const GENERATING_STATUSES = new Set([MESSAGE_STATUS.PENDING, MESSAGE_STATUS.GENERATING])

function upsertConversation(conversations, conversation) {
  const exists = conversations.some((entry) => entry.id === conversation.id)
  const next = exists
    ? conversations.map((entry) => (entry.id === conversation.id ? conversation : entry))
    : [conversation, ...conversations]
  // Stable: equal updatedAt keeps insertion order.
  return next.sort((a, b) => {
    if (a.updatedAt === b.updatedAt) return 0
    return a.updatedAt < b.updatedAt ? 1 : -1
  })
}

/**
 * Application store: conversation list, active selection, lifecycle states,
 * and every mutation (submit, regenerate, rename, delete). All persistence
 * goes through the repository layer; all generation goes through the mock
 * service — components only see this context.
 */
export default function ConversationsProvider({ children }) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [conversations, setConversations] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading')
  const [loadError, setLoadError] = useState(null)
  const [activeId, setActiveId] = useState(null)

  const conversationsRef = useRef(conversations)
  const activeIdRef = useRef(activeId)

  // Refs mirror committed state for async callbacks (never written during render).
  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])
  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  /**
   * Single write path for conversation state: updates the ref synchronously
   * *and* the state, so multi-step event logic (append → patch → persist)
   * within one handler never reads stale data.
   */
  const applyConversations = useCallback((next) => {
    conversationsRef.current = next
    setConversations(next)
  }, [])

  /** Guards against stale responses overwriting newer results. */
  const generationTokensRef = useRef(new Map())
  /** Per-conversation sequence so late saves never clobber newer state. */
  const commitSeqRef = useRef(new Map())
  /** Blocks duplicate submissions while a new conversation is being created. */
  const submittingRef = useRef(false)

  const reload = useCallback(async () => {
    setLoadStatus('loading')
    setLoadError(null)
    try {
      const list = await conversationRepository.listConversations()
      applyConversations(list)
      setLoadStatus('ready')
    } catch (error) {
      setLoadError(error?.message || 'Could not load conversations.')
      setLoadStatus('error')
    }
  }, [applyConversations])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await conversationRepository.listConversations()
        if (cancelled) return
        applyConversations(list)
        setLoadStatus('ready')
      } catch (error) {
        if (cancelled) return
        setLoadError(error?.message || 'Could not load conversations.')
        setLoadStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [applyConversations])

  /** Persist a conversation and reconcile state; failures surface as toasts. */
  const commit = useCallback(
    async (conversation) => {
      const previousSeq = commitSeqRef.current.get(conversation.id) ?? 0
      const seq = previousSeq + 1
      commitSeqRef.current.set(conversation.id, seq)

      try {
        const saved = await conversationRepository.saveConversation(conversation)
        if ((commitSeqRef.current.get(conversation.id) ?? 0) === seq) {
          applyConversations(upsertConversation(conversationsRef.current, saved))
        }
        return saved
      } catch {
        toast("Couldn’t save changes to local storage.", { tone: 'error' })
        return conversation
      }
    },
    [applyConversations, toast],
  )

  /** Replace a message inside a conversation (optimistic) and persist it. */
  const patchMessage = useCallback(
    (conversationId, messageId, patch) => {
      const conversation = conversationsRef.current.find((entry) => entry.id === conversationId)
      if (!conversation) return null

      const updated = {
        ...conversation,
        messages: conversation.messages.map((message) =>
          message.id === messageId ? { ...message, ...patch } : message,
        ),
      }
      applyConversations(upsertConversation(conversationsRef.current, updated))
      commit(updated)
      return updated
    },
    [applyConversations, commit],
  )

  /** Run (or re-run) mock generation for one message with a stale-guard token. */
  const runGeneration = useCallback(
    async (conversationId, messageId, problem) => {
      const token = createId('gen')
      generationTokensRef.current.set(messageId, token)

      patchMessage(conversationId, messageId, {
        status: MESSAGE_STATUS.GENERATING,
        solutionA: null,
        solutionB: null,
        judge: null,
        error: null,
      })

      try {
        const result = await generateComparison(problem)
        if (generationTokensRef.current.get(messageId) !== token) return // superseded
        patchMessage(conversationId, messageId, {
          ...result,
          status: MESSAGE_STATUS.COMPLETED,
          error: null,
        })
      } catch (error) {
        if (generationTokensRef.current.get(messageId) !== token) return // superseded
        patchMessage(conversationId, messageId, {
          status: MESSAGE_STATUS.FAILED,
          error: error?.message || 'Generation failed.',
          solutionA: null,
          solutionB: null,
          judge: null,
        })
      }
    },
    [patchMessage],
  )

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? null,
    [conversations, activeId],
  )

  const isGeneratingActive = Boolean(
    activeConversation?.messages.some((message) => GENERATING_STATUSES.has(message.status)),
  )

  const submitProblem = useCallback(
    async (text) => {
      const problem = String(text ?? '').trim()
      if (!problem) return { ok: false, reason: 'empty' }
      if (problem.length > MAX_PROBLEM_LENGTH) return { ok: false, reason: 'too-long' }
      if (submittingRef.current) return { ok: false, reason: 'busy' }

      const current = conversationsRef.current.find((entry) => entry.id === activeIdRef.current)
      if (current?.messages.some((message) => GENERATING_STATUSES.has(message.status))) {
        return { ok: false, reason: 'busy' }
      }
      submittingRef.current = true

      const message = {
        id: createId('msg'),
        problem,
        solutionA: null,
        solutionB: null,
        judge: null,
        status: MESSAGE_STATUS.PENDING,
        error: null,
        createdAt: new Date().toISOString(),
      }

      let conversation
      if (current) {
        conversation = { ...current, messages: [...current.messages, message] }
        applyConversations(upsertConversation(conversationsRef.current, conversation))
      } else {
        // First problem in a fresh chat: create the conversation here so no
        // empty conversations are ever persisted.
        try {
          const created = await conversationRepository.createConversation({
            title: titleFromProblem(problem),
          })
          conversation = { ...created, messages: [message] }
        } catch {
          submittingRef.current = false
          toast("Couldn’t create the conversation (storage unavailable).", { tone: 'error' })
          return { ok: false, reason: 'persist' }
        }
      applyConversations(upsertConversation(conversationsRef.current, conversation))
      navigate(`/c/${conversation.id}`)
      }

      commit(conversation)
      submittingRef.current = false
      runGeneration(conversation.id, message.id, problem)
      return { ok: true }
    },
    [applyConversations, commit, navigate, runGeneration, toast],
  )

  const retryMessage = useCallback(
    (messageId) => {
      const conversation = conversationsRef.current.find(
        (entry) => entry.id === activeIdRef.current,
      )
      const message = conversation?.messages.find((entry) => entry.id === messageId)
      if (!conversation || !message) return false
      if (GENERATING_STATUSES.has(message.status)) return false
      runGeneration(conversation.id, message.id, message.problem)
      return true
    },
    [runGeneration],
  )

  const editProblem = useCallback(
    (messageId, text) => {
      const problem = String(text ?? '').trim()
      if (!problem) return { ok: false, reason: 'empty' }
      if (problem.length > MAX_PROBLEM_LENGTH) return { ok: false, reason: 'too-long' }

      const conversation = conversationsRef.current.find(
        (entry) => entry.id === activeIdRef.current,
      )
      const message = conversation?.messages.find((entry) => entry.id === messageId)
      if (!conversation || !message) return { ok: false, reason: 'not-found' }
      if (message.problem === problem && message.status === MESSAGE_STATUS.COMPLETED) {
        return { ok: false, reason: 'unchanged' }
      }

      // Invalidate stale results immediately, then regenerate under a new
      // token so any older in-flight response is ignored.
      patchMessage(conversation.id, messageId, {
        problem,
        status: MESSAGE_STATUS.PENDING,
        solutionA: null,
        solutionB: null,
        judge: null,
        error: null,
      })
      runGeneration(conversation.id, messageId, problem)
      return { ok: true }
    },
    [patchMessage, runGeneration],
  )

  const renameConversation = useCallback(
    async (conversationId, text) => {
      const title = String(text ?? '').trim()
      if (!title) return { ok: false, reason: 'empty' }

      const conversation = conversationsRef.current.find((entry) => entry.id === conversationId)
      if (!conversation) return { ok: false, reason: 'not-found' }

      const updated = { ...conversation, title }
      applyConversations(upsertConversation(conversationsRef.current, updated))
      await commit(updated)
      return { ok: true }
    },
    [applyConversations, commit],
  )

  const deleteConversation = useCallback(
    async (conversationId) => {
      try {
        await conversationRepository.deleteConversation(conversationId)
      } catch {
        toast("Couldn’t delete the conversation (storage unavailable).", { tone: 'error' })
        return false
      }
      const conversation = conversationsRef.current.find((entry) => entry.id === conversationId)
      conversation?.messages.forEach((message) => {
        generationTokensRef.current.delete(message.id)
      })
      applyConversations(conversationsRef.current.filter((entry) => entry.id !== conversationId))
      if (activeIdRef.current === conversationId) {
        setActiveId(null)
        navigate('/')
      }
      return true
    },
    [applyConversations, navigate, toast],
  )

  const newChat = useCallback(() => {
    setActiveId(null)
    navigate('/')
  }, [navigate])

  const value = useMemo(
    () => ({
      conversations,
      loadStatus,
      loadError,
      reload,
      activeId,
      setActiveId,
      activeConversation,
      isGeneratingActive,
      submitProblem,
      retryMessage,
      editProblem,
      renameConversation,
      deleteConversation,
      newChat,
    }),
    [
      conversations,
      loadStatus,
      loadError,
      reload,
      activeId,
      activeConversation,
      isGeneratingActive,
      submitProblem,
      retryMessage,
      editProblem,
      renameConversation,
      deleteConversation,
      newChat,
    ],
  )

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>
}
