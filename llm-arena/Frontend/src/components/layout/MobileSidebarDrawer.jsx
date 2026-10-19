import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useScrollLock } from '../../hooks/useScrollLock.js'
import ConversationListPanel from '../../features/chat-history/components/ConversationListPanel.jsx'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Mobile slide-out history drawer: backdrop click and Escape close it,
 * background scrolling is locked, focus moves in on open and returns to the
 * trigger on close, Tab stays trapped inside, and selecting a conversation
 * closes the drawer.
 */
export default function MobileSidebarDrawer({ open, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocusRef = useRef(null)

  useScrollLock(open)

  useEffect(() => {
    if (!open) return undefined

    previousFocusRef.current = document.activeElement
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusables = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null,
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-neutral-900/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onMouseDown={onClose}
      />
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-label="Conversation history"
        inert={!open}
        className={`absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col border-r border-neutral-200 bg-white shadow-xl transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
          <span className="text-sm font-semibold text-neutral-900">Conversations</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close conversation history"
            className="flex size-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <ConversationListPanel onAfterSelect={onClose} />
      </nav>
    </div>
  )
}
