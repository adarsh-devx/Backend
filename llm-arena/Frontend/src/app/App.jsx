import { BrowserRouter } from 'react-router-dom'
import ToastProvider from './providers/ToastProvider.jsx'
import ConversationsProvider from './providers/ConversationsProvider.jsx'
import AppRoutes from './routes.jsx'

/**
 * Application root. Provider order matters: the conversation store uses
 * router hooks, so the router wraps everything.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConversationsProvider>
          <AppRoutes />
        </ConversationsProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
