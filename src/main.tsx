import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { DirectionProvider } from '@/components/foundations/direction/direction'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DirectionProvider locale="th-TH">
      <App />
    </DirectionProvider>
  </StrictMode>,
)
