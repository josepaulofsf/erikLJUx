import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/paginainicial.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
