import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface Destination {
  id: string
  name: string
  country: string
  image: string
  popularity: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [recentTrips, setRecentTrips] = useState<Trip[]>([])
  const [recommendedDestinations, setRecommendedDestinations] = useState<Destination[]>([])

  useEffect(() => {
    // Mock data - replace with actual API calls
    setRecentTrips([
      {
        id: '1',
        destination: 'Paris, France',
        startDate: '2024-03-15',
        endDate: '2024-03-22',
        budget: 2500,
        status: 'upcoming'
      },
      {
        id: '2',
        destination: 'Tokyo, Japan',
        startDate: '2024-02-10',
        endDate: '2024-02-17',
        budget: 3200,
        status: 'completed'
      }
    ])

    setRecommendedDestinations([
      { id: '1', name: 'Barcelona', country: 'Spain', image: '/api/placeholder/300/200', popularity: 95 },
      { id: '2', name: 'Bali', country: 'Indonesia', image: '/api/placeholder/300/200', popularity: 92 },
      { id: '3', name: 'New York', country: 'USA', image: '/api/placeholder/300/200', popularity: 88 }
    ])
  }, [])

  const totalBudget = recentTrips.reduce((sum, trip) => sum + trip.budget, 0)
  const upcomingTrips = recentTrips.filter(trip => trip.status === 'upcoming')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.identifier?.split('@')[0] || 'Traveler'}!
          </h1>
          <p className="text-muted-foreground">
            Ready for your next adventure? Let's plan something amazing.
          </p>
        </div>
        <Link to="/plan-trip">
          <Button size="lg" className="px-6">
            <Plus className="mr-2 h-5 w-5" />
            Plan New Trip
          </Button>
        </Link>
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
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries Visited</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTrips.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Trips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trips</CardTitle>
            <Link to="/trips">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{trip.destination}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${trip.budget.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        trip.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No trips yet. Start planning your first adventure!
              </p>
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
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                  </div>
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
  )
}