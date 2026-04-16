import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, Teacher, Admin, Parent, AuthSession } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface AuthContextType {
  session: AuthSession
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  user: User | Teacher | Admin | Parent | null
  token: string | null
  isHydrated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    token: undefined,
    isAuthenticated: false,
  })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('authSession')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSession(parsed)
      } catch (e) {
        console.error('Failed to load auth session:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        console.log('Login failed')
        return false
      }

      const { token, user } = await res.json()

      const newSession: AuthSession = {
        user,
        token,
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
      }

      setSession(newSession)
      localStorage.setItem('authSession', JSON.stringify(newSession))

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setSession({
      user: null,
      token: undefined,
      isAuthenticated: false,
    })
    localStorage.removeItem('authSession')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        isAuthenticated: session.isAuthenticated,
        user: session.user,
        token: session.token || null,
        isHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}