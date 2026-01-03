import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Calendar, DollarSign, TrendingUp, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { tripService } from '@/services/trip.service'
import { pexelsService } from '@/services/pexels.service'
import { toastUtils } from '@/lib/toast-utils'

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  description?: string
  cover_photo_url?: string
  created_at: string
}

interface Destination {
  id: string
  name: string
  country: string
  image: string
  popularity: number
}

interface BannerImage {
  url: string
  photographer: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [bannerImage, setBannerImage] = useState<BannerImage | null>(null)
  const [recommendedDestinations, setRecommendedDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    // Filter trips based on search query
    if (searchQuery.trim() === '') {
      setFilteredTrips(trips)
    } else {
      const filtered = trips.filter(trip => 
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTrips(filtered)
    }
  }, [searchQuery, trips])

  const loadDashboardData = async () => {
    try {
      // Load user trips
      const userTrips = await tripService.getTrips()
      setTrips(userTrips)
      setFilteredTrips(userTrips)
      
      // Load banner image
      await loadBannerImage()
      
      // Set recommended destinations (mock data)
      setRecommendedDestinations([
        { id: '1', name: 'Barcelona', country: 'Spain', image: pexelsService.getFallbackImage('barcelona'), popularity: 95 },
        { id: '2', name: 'Bali', country: 'Indonesia', image: pexelsService.getFallbackImage('bali'), popularity: 92 },
        { id: '3', name: 'New York', country: 'USA', image: pexelsService.getFallbackImage('new york'), popularity: 88 }
      ])
    } catch (error) {
      toastUtils.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadBannerImage = async () => {
    const queries = ['travel destination', 'beautiful places', 'famous landmarks', 'vacation spots']
    const randomQuery = queries[Math.floor(Math.random() * queries.length)]
    
    try {
      const photos = await pexelsService.searchPhotos(randomQuery, 1)
      if (photos.length > 0) {
        setBannerImage({
          url: photos[0].src.large,
          photographer: photos[0].photographer
        })
      } else {
        setBannerImage({
          url: pexelsService.getFallbackImage('travel'),
          photographer: 'Unsplash'
        })
      }
    } catch (error) {
      setBannerImage({
        url: pexelsService.getFallbackImage('travel'),
        photographer: 'Unsplash'
      })
    }
  }

  const upcomingTrips = trips.filter(trip => {
    const startDate = new Date(trip.start_date)
    return startDate > new Date()
  })

  const getTripStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' }
    if (now >= start && now <= end) return { status: 'ongoing', color: 'bg-green-100 text-green-800' }
    return { status: 'completed', color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {bannerImage && (
        <div 
          className="relative h-80 bg-cover bg-center mb-8"
          style={{ backgroundImage: `url(${bannerImage.url})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Discover Your Next Adventure
              </h1>
              <p className="text-xl mb-6 opacity-90">
                Plan, explore, and create unforgettable memories around the world
              </p>
              <Link to="/plan-trip">
                <Button size="lg" className="px-8 py-3 text-lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-white/70 text-xs">
            Photo by {bannerImage.photographer}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section with Search */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.identifier?.split('@')[0] || 'Traveler'}!
              </h2>
              <p className="text-muted-foreground">
                Manage your trips and discover new destinations
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingTrips.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trips.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries Visited</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(trips.map(t => t.title.split(',')[1]?.trim())).size || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Trips {searchQuery && `(${filteredTrips.length} found)`}</CardTitle>
              <Link to="/trips">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading trips...</div>
              ) : filteredTrips.length > 0 ? (
                <div className="space-y-4">
                  {filteredTrips.slice(0, 3).map((trip) => {
                    const { status, color } = getTripStatus(trip.start_date, trip.end_date)
                    return (
                      <Link key={trip.id} to={`/trip/${trip.id}/view`}>
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            {trip.cover_photo_url ? (
                              <img 
                                src={trip.cover_photo_url} 
                                alt={trip.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">{trip.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
                            {status}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No trips found matching your search.' : 'No trips yet. Start planning your first adventure!'}
                  </p>
                  {!searchQuery && (
                    <Link to="/plan-trip" className="mt-4 inline-block">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Trip
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Destinations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recommended Destinations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedDestinations.map((destination) => (
                  <div key={destination.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div 
                      className="w-12 h-12 bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${destination.image})` }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{destination.name}</h4>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{destination.popularity}%</div>
                      <div className="text-xs text-muted-foreground">popularity</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}