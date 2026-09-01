import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/app.store'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #27272a',
              borderRadius: '12px',
              fontSize: '13px',
              padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            },
          }}
        />
    </Provider>
)
