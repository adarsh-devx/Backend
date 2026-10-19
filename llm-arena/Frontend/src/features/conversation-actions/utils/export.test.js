import { describe, expect, it } from 'vitest'
import {
  buildConversationJSON,
  buildConversationMarkdown,
  buildMessageMarkdown,
  conversationFilename,
} from './export.js'

function makeConversation() {
  return {
    id: 'conv-1',
    title: 'Cache strategy review',
    createdAt: '2026-10-19T10:00:00.000Z',
    updatedAt: '2026-10-19T11:00:00.000Z',
    archivedAt: null,
    messages: [
      {
        id: 'msg-1',
        problem: 'How should I cache expensive queries?',
        solutionA: { content: '### Approach A\n\nUse a TTL map.', provider: 'Mock Provider A' },
        solutionB: { content: '### Approach B\n\nUse Redis.', provider: 'Mock Provider B' },
        judge: {
          solutionAScore: 8,
          solutionBScore: 9,
          reasoning: '**Solution A** fine.\n\n**Solution B** better.',
          recommendedSolution: 'B',
        },
        status: 'completed',
        error: null,
        createdAt: '2026-10-19T10:00:05.000Z',
      },
    ],
  }
}

describe('buildConversationMarkdown', () => {
  it('includes title, export timestamp, problems, solutions, scores, reasoning, verdict', () => {
    const markdown = buildConversationMarkdown(makeConversation(), {
      exportedAt: '2026-10-19T12:00:00.000Z',
    })

    expect(markdown).toContain('# Cache strategy review')
    expect(markdown).toContain('Exported')
    expect(markdown).toContain('## Problem')
    expect(markdown).toContain('How should I cache expensive queries?')
    expect(markdown).toContain('Solution A — Mock Provider A')
    expect(markdown).toContain('Solution B — Mock Provider B')
    expect(markdown).toContain('Use a TTL map.')
    expect(markdown).toContain('- Solution A score: 8/10')
    expect(markdown).toContain('- Solution B score: 9/10')
    expect(markdown).toContain('- Verdict: Solution B')
    expect(markdown).toContain('**Solution B** better.')
    expect(markdown).toContain('---')
  })

  it('handles a conversation with no messages', () => {
    const empty = { ...makeConversation(), messages: [] }
    const markdown = buildConversationMarkdown(empty)
    expect(markdown).toContain('no messages yet')
  })
})

describe('buildMessageMarkdown', () => {
  it('renders a standalone comparison with problem, both solutions, and judge', () => {
    const markdown = buildMessageMarkdown(makeConversation().messages[0])
    expect(markdown).toContain('### Problem')
    expect(markdown).toContain('### Solution A — Mock Provider A')
    expect(markdown).toContain('### Judge')
    expect(markdown).toContain('8/10')
    expect(markdown).toContain('9/10')
  })

  it('degrades gracefully for a failed message', () => {
    const markdown = buildMessageMarkdown({
      id: 'm',
      problem: 'x',
      solutionA: null,
      solutionB: null,
      judge: null,
      status: 'failed',
    })
    expect(markdown).toContain('_Solution A unavailable._')
    expect(markdown).toContain('Unavailable')
  })
})

describe('buildConversationJSON', () => {
  it('produces valid JSON equal to the stored conversation', () => {
    const conversation = makeConversation()
    const parsed = JSON.parse(buildConversationJSON(conversation))
    expect(parsed).toEqual(conversation)
  })
})

describe('conversationFilename', () => {
  it('slugifies titles into safe filenames', () => {
    expect(conversationFilename('Cache Strategy Review!', 'md')).toBe('cache-strategy-review.md')
    expect(conversationFilename('  spaced / out  ', 'json')).toBe('spaced-out.json')
  })

  it('falls back when the title yields no usable slug', () => {
    expect(conversationFilename('!!!', 'md')).toBe('conversation.md')
    expect(conversationFilename('', 'json')).toBe('conversation.json')
  })
})
