import { PanelLeft, Plus, Scale } from 'lucide-react'
import { APP_NAME } from '../../constants/index.js'

/**
 * Compact application header. Icon-only toggles on small screens (with
 * accessible labels); the wordmark never competes with actions.
 */
export default function AppHeader({
  desktopSidebarExpanded,
  onToggleDesktopSidebar,
  onOpenDrawer,
  onNewChat,
}) {
  return (
    <header className="shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex h-14 items-center gap-1.5 px-3 sm:gap-2 sm:px-4">
        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          aria-expanded={desktopSidebarExpanded}
          aria-label="Toggle conversation sidebar"
          className="hidden size-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 md:flex"
        >
          <PanelLeft size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open conversation history"
          className="flex size-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 md:hidden"
        >
          <PanelLeft size={17} aria-hidden="true" />
        </button>

        <div className="flex min-w-0 items-center gap-2.5 pl-0.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <Scale size={14} strokeWidth={2.25} aria-hidden="true" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">{APP_NAME}</span>
          <span
            title="Solutions and judge results come from local mock fixtures, not a real AI provider."
            className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-500 lg:inline-flex"
          >
            Mock data
          </span>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:px-3 sm:py-1.5"
        >
          <Plus size={15} aria-hidden="true" />
          <span className="hidden sm:inline">New Chat</span>
          <span className="sr-only sm:hidden">New Chat</span>
        </button>
      </div>
    </header>
  )
}
