import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { SkipToMain } from '@/lib/accessibility'
import { usePreferences } from '@/contexts/PreferencesContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { preferences } = usePreferences()

  // Apply theme on mount and preference change
  useEffect(() => {
    const theme = preferences.theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : preferences.theme

    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [preferences.theme])

  return (
    <div className="min-h-screen bg-background">
      <SkipToMain />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  )
}