import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { BuilderProvider } from './context/BuilderContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <BuilderProvider>
          <App />
        </BuilderProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
