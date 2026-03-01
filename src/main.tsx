import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
import { isAdSenseEnabled, adsense } from './config'

// Ladda AdSense-script när konfigurerat
if (isAdSenseEnabled && adsense.client) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
