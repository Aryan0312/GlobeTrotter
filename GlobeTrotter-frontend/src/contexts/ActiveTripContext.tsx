import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface ActiveTripContextType {
  activeTripId: string | null
  setActiveTrip: (tripId: string | null) => void
}

const ActiveTripContext = createContext<ActiveTripContextType | undefined>(undefined)

export function ActiveTripProvider({ children }: { children: ReactNode }) {
  const [activeTripId, setActiveTripId] = useState<string | null>(null)

  const setActiveTrip = (tripId: string | null) => {
    setActiveTripId(tripId)
  }

  return (
    <ActiveTripContext.Provider value={{ activeTripId, setActiveTrip }}>
      {children}
    </ActiveTripContext.Provider>
  )
}

export function useActiveTrip() {
  const context = useContext(ActiveTripContext)
  if (context === undefined) {
    throw new Error('useActiveTrip must be used within an ActiveTripProvider')
  }
  return context
}