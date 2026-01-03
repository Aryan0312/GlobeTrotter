import api from './api'

interface CreateTripRequest {
  name: string
  startDate: string
  endDate: string
  description?: string
  coverPhotoUrl?: string
}

interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  description?: string
  coverPhotoUrl?: string
  createdAt: string
}

export const tripService = {
  async createTrip(data: CreateTripRequest): Promise<Trip> {
    const response = await api.post('/trip', data)
    return response.data
  },

  async getTrips(): Promise<Trip[]> {
    const response = await api.get('/trip')
    return response.data
  },

  async getTripById(id: string): Promise<Trip> {
    const response = await api.get(`/trip/${id}`)
    return response.data
  },
}