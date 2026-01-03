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
  title: string
  start_date: string
  end_date: string
  description?: string
  cover_photo_url?: string
  created_at: string
}

export const tripService = {
  async createTrip(data: CreateTripRequest): Promise<Trip> {
    try {
      console.log('Sending trip data:', {
        title: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        coverPhotoUrl: data.coverPhotoUrl
      })
      
      const response = await api.post('/trip', {
        title: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        coverPhotoUrl: data.coverPhotoUrl
      })
      return response.data.data
    } catch (error: any) {
      console.error('Trip creation error:', error.response?.data)
      throw new Error(error.response?.data?.message || 'Failed to create trip')
    }
  },

  async getTrips(): Promise<Trip[]> {
    const response = await api.get('/trip')
    return response.data.data
  },

  async getTripById(id: string): Promise<Trip> {
    const response = await api.get(`/trip/${id}`)
    return response.data.data
  },

  async updateTrip(id: string, data: Partial<CreateTripRequest>): Promise<Trip> {
    const response = await api.put(`/trip/${id}`, {
      title: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      coverPhotoUrl: data.coverPhotoUrl
    })
    return response.data.data
  },

  async deleteTrip(id: string): Promise<void> {
    await api.delete(`/trip/${id}`)
  },
}