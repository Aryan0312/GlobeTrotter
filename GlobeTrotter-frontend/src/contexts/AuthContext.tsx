import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  identifier: string
  name: string
  role: 'user' | 'admin'
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  // Restore auth state on app load
  useEffect(() => {
    const userData = localStorage.getItem('auth_user')
    
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setState({
          isAuthenticated: true,
          user,
          token: null,
        })
      } catch {
        localStorage.removeItem('auth_user')
      }
    }
  }, [])

  const login = (user: User) => {
    localStorage.setItem('auth_user', JSON.stringify(user))
    setState({
      isAuthenticated: true,
      user,
      token: null,
    })
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}