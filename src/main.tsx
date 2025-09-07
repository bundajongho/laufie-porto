import React from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import '@/styles/globals.css'
import '@/styles/scrollbar.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)