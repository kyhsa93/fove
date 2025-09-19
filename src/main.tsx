import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element가 존재하지 않습니다.')
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
