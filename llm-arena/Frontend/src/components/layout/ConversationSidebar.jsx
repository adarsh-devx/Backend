import ConversationListPanel from '../../features/chat-history/components/ConversationListPanel.jsx'

/** Desktop conversation sidebar (collapsible from the header toggle). */
export default function ConversationSidebar() {
  return (
    <aside
      aria-label="Conversation history"
      className="hidden w-72 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50/60 md:flex"
    >
      <ConversationListPanel />
    </aside>
  )
}
