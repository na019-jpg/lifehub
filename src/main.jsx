import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { inject } from '@vercel/analytics'
import { ContentProvider } from './contexts/ContentContext'

// Vercel Analytics 활성화 (방문자 통계 추적)
inject()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ContentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContentProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
