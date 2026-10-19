import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader.jsx'
import ConversationSidebar from '../components/layout/ConversationSidebar.jsx'
import MobileSidebarDrawer from '../components/layout/MobileSidebarDrawer.jsx'
import { useConversations } from './providers/useConversations.js'
import { usePersistentState } from '../hooks/usePersistentState.js'

/**
 * Application shell: compact header, collapsible desktop sidebar, mobile
 * drawer, and the routed conversation area.
 */
export default function AppLayout() {
  const { newChat } = useConversations()
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistentState(
    'verdict.sidebar.collapsed',
    false,
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  // The drawer closes through explicit actions: selecting a conversation,
  // New Chat inside it, the close button, backdrop click, and Escape.
  return (
    <div className="flex h-full flex-col bg-white">
      <AppHeader
        desktopSidebarExpanded={!sidebarCollapsed}
        onToggleDesktopSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
        onOpenDrawer={() => setDrawerOpen(true)}
        onNewChat={newChat}
      />

      <div className="flex min-h-0 flex-1">
        {!sidebarCollapsed && <ConversationSidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>

      <MobileSidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
