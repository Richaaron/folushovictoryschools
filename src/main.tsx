import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { DEFAULT_SUBJECTS } from './types'
import './index.css'

function initializeSubjects() {
  const existingSubjects = localStorage.getItem('subjects')
  if (!existingSubjects || JSON.parse(existingSubjects).length === 0) {
    localStorage.setItem('subjects', JSON.stringify(DEFAULT_SUBJECTS))
  }
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initializeSubjects()
    setInitialized(true)
  }, [])

  if (!initialized) return null

  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppInitializer>
        <App />
      </AppInitializer>
    </AuthProvider>
  </React.StrictMode>,
)
