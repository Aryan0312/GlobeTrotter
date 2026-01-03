const PEXELS_API_KEY = 'mZt7gf352RwhStqLZXnrKGa7aABZ4Rrfd7SHcPOMxSChoUahzEPQCKKS' // Replace with actual key

interface PexelsPhoto {
  id: number
  url: string
  photographer: string
  src: {
    large: string
    medium: string
    small: string
  }
}

export const pexelsService = {
  async searchPhotos(query: string, perPage: number = 1): Promise<PexelsPhoto[]> {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': PEXELS_API_KEY
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos')
      }
      
      const data = await response.json()
      return data.photos || []
    } catch (error) {
      console.error('Pexels API error:', error)
      return []
    }
  },

  // Fallback images for when API fails
  getFallbackImage(query: string): string {
    const fallbacks: Record<string, string> = {
      'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop',
      'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=400&fit=crop',
      'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=400&fit=crop',
      'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
      'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop'
    }
    
    return fallbacks[query.toLowerCase()] || fallbacks['travel']
  }
}