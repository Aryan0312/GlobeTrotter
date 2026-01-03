import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  status: 'planned' | 'active' | 'completed'
  participants: string[]
}

interface TripsContextType {
  trips: Trip[]
  addTrip: (trip: Omit<Trip, 'id'>) => void
  updateTrip: (id: string, updates: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  getTrip: (id: string) => Trip | undefined
}

const TripsContext = createContext<TripsContextType | undefined>(undefined)

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([])

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = { ...trip, id: Date.now().toString() }
    setTrips(prev => [...prev, newTrip])
  }

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...updates } : trip
    ))
  }

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id))
  }

  const getTrip = (id: string) => {
    return trips.find(trip => trip.id === id)
  }

  return (
    <TripsContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, getTrip }}>
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  const context = useContext(TripsContext)
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripsProvider')
  }
  return context
}