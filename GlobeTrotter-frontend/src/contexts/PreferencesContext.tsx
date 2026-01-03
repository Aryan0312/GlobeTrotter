import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface Preferences {
  theme: 'light' | 'dark' | 'system'
  currency: string
  language: string
  notifications: {
    email: boolean
    push: boolean
    tripReminders: boolean
  }
  privacy: {
    profileVisible: boolean
    tripsVisible: boolean
  }
}

interface PreferencesContextType {
  preferences: Preferences
  updatePreferences: (updates: Partial<Preferences>) => void
}

const defaultPreferences: Preferences = {
  theme: 'system',
  currency: 'USD',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    tripReminders: true,
  },
  privacy: {
    profileVisible: true,
    tripsVisible: false,
  },
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)

  useEffect(() => {
    const saved = localStorage.getItem('user_preferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch {
        localStorage.removeItem('user_preferences')
      }
    }
  }, [])

  const updatePreferences = (updates: Partial<Preferences>) => {
    const newPreferences = { ...preferences, ...updates }
    setPreferences(newPreferences)
    localStorage.setItem('user_preferences', JSON.stringify(newPreferences))
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}