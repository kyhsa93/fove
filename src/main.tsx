import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ResultHistoryProvider } from './hooks/useResultHistory'
import { ToastProvider } from './components/ToastProvider'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element가 존재하지 않습니다.')
}

createRoot(container).render(
  <React.StrictMode>
    <ToastProvider>
      <ResultHistoryProvider>
        <App />
      </ResultHistoryProvider>
    </ToastProvider>
  </React.StrictMode>
)
