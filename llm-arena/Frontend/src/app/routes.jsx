import { Route, Routes } from 'react-router-dom'
import AppLayout from './AppLayout.jsx'
import ChatPage from '../features/chat/components/ChatPage.jsx'

/** Routes: "/" starts a fresh chat, "/c/:id" opens a stored conversation. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/c/:conversationId" element={<ChatPage />} />
        <Route path="*" element={<ChatPage />} />
      </Route>
    </Routes>
  )
}
