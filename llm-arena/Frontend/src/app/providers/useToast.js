import { useContext } from 'react'
import { ToastContext } from './toastContext.js'

/** Access toast notifications: `const { toast } = useToast()`. */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
