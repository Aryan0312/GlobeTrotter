// import api from './api' // Ready for real API integration

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string
  rating: number
}

interface Activity {
  id: string
  name: string
  type: string
  location: string
  price: number
  rating: number
}

interface SearchFilters {
  query?: string
  country?: string
  minRating?: number
  maxPrice?: number
}

// Mock data
const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Vibrant metropolis with rich culture',
    image: '/images/tokyo.jpg',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Paris',
    country: 'France',
    description: 'City of lights and romance',
    image: '/images/paris.jpg',
    rating: 4.7,
  },
]

const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Sushi Making Class',
    type: 'Food & Drink',
    location: 'Tokyo',
    price: 85,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Eiffel Tower Tour',
    type: 'Sightseeing',
    location: 'Paris',
    price: 45,
    rating: 4.6,
  },
]

export const searchService = {
  async searchDestinations(filters: SearchFilters = {}): Promise<Destination[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    let results = mockDestinations
    
    if (filters.query) {
      results = results.filter(d => 
        d.name.toLowerCase().includes(filters.query!.toLowerCase()) ||
        d.country.toLowerCase().includes(filters.query!.toLowerCase())
      )
    }
    
    if (filters.minRating) {
      results = results.filter(d => d.rating >= filters.minRating!)
    }
    
    return results
  },

  async searchActivities(filters: SearchFilters = {}): Promise<Activity[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    let results = mockActivities
    
    if (filters.query) {
      results = results.filter(a => 
        a.name.toLowerCase().includes(filters.query!.toLowerCase()) ||
        a.type.toLowerCase().includes(filters.query!.toLowerCase())
      )
    }
    
    if (filters.maxPrice) {
      results = results.filter(a => a.price <= filters.maxPrice!)
    }
    
    return results
  },

  async getPopularDestinations(): Promise<Destination[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockDestinations.sort((a, b) => b.rating - a.rating)
  },
}