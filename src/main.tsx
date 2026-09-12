import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* import.meta.env.BASE_URL mirrors vite.config.ts's `base` at runtime
        ('/de-otter/' in production, '/' in dev) — without it, every
        route (and any Link to="/") resolves against the domain root
        instead of the actual GitHub Pages subpath. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
