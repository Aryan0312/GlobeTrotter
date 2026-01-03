import api from './api'

// Interfaces
interface ItineraryDay {
  id: string
  day_number: number
  date: string
  city?: string
  country?: string
}

interface CreateDayRequest {
  dayNumber: number
  date: string
  city?: string
  country?: string
}

interface ItineraryBlock {
  id: string
  block_type: 'ACTIVITY' | 'REST' | 'SLEEP' | 'GAP'
  title: string
  description?: string
  start_time: string
  end_time: string
  estimated_cost?: number
}

interface CreateBlockRequest {
  blockType: 'ACTIVITY' | 'REST' | 'SLEEP' | 'GAP'
  title: string
  description?: string
  startTime: string
  endTime: string
  estimatedCost?: number
}

export const itineraryService = {
  // STEP 2: Create itinerary days for a trip
  async createDay(tripId: string, data: CreateDayRequest): Promise<{ id: string }> {
    const response = await api.post(`/itinerary-days/${tripId}`, data)
    return response.data.data
  },

  // STEP 3: Fetch days for a trip
  async getDays(tripId: string): Promise<ItineraryDay[]> {
    const response = await api.get(`/itinerary-days/${tripId}`)
    return response.data.data
  },

  // STEP 4: Create itinerary block inside a day
  async createBlock(dayId: string, data: CreateBlockRequest): Promise<{ id: string }> {
    const response = await api.post(`/itinerary/blocks/${dayId}`, data)
    return response.data.data
  },

  // STEP 5: Fetch blocks for a day (timeline)
  async getBlocks(dayId: string): Promise<ItineraryBlock[]> {
    const response = await api.get(`/itinerary/blocks/${dayId}`)
    return response.data.data
  },

  // STEP 6: Update a block
  async updateBlock(blockId: string, data: Partial<CreateBlockRequest>): Promise<void> {
    await api.put(`/itinerary/blocks/block/${blockId}`, data)
  },

  // STEP 7: Delete a block
  async deleteBlock(blockId: string): Promise<void> {
    await api.delete(`/itinerary/blocks/block/${blockId}`)
  },
}