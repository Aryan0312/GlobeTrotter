// import api from './api' // Ready for real API integration

interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  status: 'planned' | 'active' | 'completed'
  participants: string[]
}

interface CreateTripRequest {
  title: string
  destination: string
  startDate: string
  endDate: string
}

// Mock data
const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2024-06-01',
    endDate: '2024-06-10',
    status: 'planned',
    participants: ['user1'],
  },
  {
    id: '2',
    title: 'European Tour',
    destination: 'Paris, France',
    startDate: '2024-07-15',
    endDate: '2024-07-30',
    status: 'active',
    participants: ['user1', 'user2'],
  },
]

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockTrips
  },

  async getTrip(id: string): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const trip = mockTrips.find(t => t.id === id)
    if (!trip) throw new Error('Trip not found')
    return trip
  },

  async createTrip(data: CreateTripRequest): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newTrip: Trip = {
      ...data,
      id: Date.now().toString(),
      status: 'planned',
      participants: ['user1'],
    }
    mockTrips.push(newTrip)
    return newTrip
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 800))
    const index = mockTrips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    mockTrips[index] = { ...mockTrips[index], ...updates }
    return mockTrips[index]
  },

  async deleteTrip(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockTrips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    mockTrips.splice(index, 1)
  },
}