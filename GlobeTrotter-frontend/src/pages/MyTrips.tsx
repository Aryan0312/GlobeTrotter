import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, MapPin, Edit, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tripService } from '@/services/trip.service'
import { toastUtils } from '@/lib/toast-utils'

interface Trip {
  id: string
  title: string  // Backend returns 'title', not 'name'
  start_date: string  // Backend uses snake_case
  end_date: string
  description?: string
  cover_photo_url?: string
  created_at: string
  destinationCount?: number
}

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      const data = await tripService.getTrips()
      setTrips(data)
    } catch (error) {
      toastUtils.error('Failed to load trips')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return
    
    try {
      await tripService.deleteTrip(tripId)
      setTrips(trips.filter(trip => trip.id !== tripId))
      toastUtils.success('Trip deleted successfully')
    } catch (error) {
      toastUtils.error('Failed to delete trip')
    }
  }

  const getTripStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' }
    if (now >= start && now <= end) return { status: 'ongoing', color: 'bg-green-100 text-green-800' }
    return { status: 'completed', color: 'bg-gray-100 text-gray-800' }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString()
    const end = new Date(endDate).toLocaleDateString()
    return `${start} - ${end}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading trips...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-muted-foreground">
            Manage your travel adventures and upcoming plans
          </p>
        </div>
        <Link to="/plan-trip">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Trip Cards */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const { status, color } = getTripStatus(trip.start_date, trip.end_date)
            
            return (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Cover Image */}
                {trip.cover_photo_url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={trip.cover_photo_url}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{trip.title}</CardTitle>
                    <Badge className={`text-xs ${color}`}>
                      {status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Date Range */}
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange(trip.start_date, trip.end_date)}
                  </div>

                  {/* Destination Count */}
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="mr-2 h-4 w-4" />
                    {trip.destinationCount || 0} destinations
                  </div>

                  {/* Description */}
                  {trip.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {trip.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/trip/${trip.id}/view`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/trip/${trip.id}/builder`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Plan
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-6">
            Start planning your first adventure and create unforgettable memories
          </p>
          <Link to="/plan-trip">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}