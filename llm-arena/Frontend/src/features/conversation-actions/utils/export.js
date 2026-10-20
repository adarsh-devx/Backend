import {
  formatScore,
  resolveWinner,
  verdictSummary,
  winnerLabel,
} from '../../judge/utils/winner.js'
import { formatDateTime } from '../../chat-history/utils/time.js'

/**
 * Copy/export builders — pure functions over stored conversation data.
 * No application state or secrets enter these builders; the JSON export is
 * exactly the structured conversation.
 */

function scoreLine(label, score) {
  return `- ${label}: ${formatScore(score)}`
}

function messageSection(message, headingLevel = '##') {
  const lines = [
    `${headingLevel} Problem`,
    '',
    message.problem,
    '',
    `${headingLevel} Solution A — ${message.solutionA?.provider ?? 'Provider A'}`,
    '',
    message.solutionA?.content ?? '_Solution A unavailable._',
    '',
    `${headingLevel} Solution B — ${message.solutionB?.provider ?? 'Provider B'}`,
    '',
    message.solutionB?.content ?? '_Solution B unavailable._',
    '',
    `${headingLevel} Judge`,
    '',
    scoreLine('Solution A score', message.judge?.solutionAScore),
    scoreLine('Solution B score', message.judge?.solutionBScore),
    `- Verdict: ${winnerLabel(resolveWinner(message.judge).winner)}`,
    '',
    `> ${verdictSummary(message.judge)}`,
    '',
    message.judge?.reasoning?.trim() || '_No judge reasoning available._',
  ]
  return lines.join('\n')
}

/** Full comparison for one problem (used by "copy complete comparison"). */
export function buildMessageMarkdown(message) {
  return messageSection(message, '###')
}

/** Markdown export of an entire conversation. */
export function buildConversationMarkdown(conversation, { exportedAt = new Date().toISOString() } = {}) {
  const header = [
    `# ${conversation.title}`,
    '',
    `_Exported ${formatDateTime(exportedAt)}_`,
    '',
  ].join('\n')

  const body =
    conversation.messages.length === 0
      ? '_This conversation has no messages yet._'
      : conversation.messages.map((message) => messageSection(message)).join('\n\n---\n\n')

  return `${header}\n---\n\n${body}\n`
}

/** JSON export of the stored conversation structure. */
export function buildConversationJSON(conversation) {
  return JSON.stringify(conversation, null, 2)
}

/** Filesystem-safe filename derived from the conversation title. */
export function conversationFilename(title, extension) {
  const slug = String(title ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${slug || 'conversation'}.${extension}`
}

/** Trigger a browser download for generated text. */
export function downloadTextFile(filename, text, mimeType) {
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
