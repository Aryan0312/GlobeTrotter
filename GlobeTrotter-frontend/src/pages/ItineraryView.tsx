import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, List, Clock, MapPin, DollarSign, ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tripService } from '@/services/trip.service'
import { itineraryService } from '@/services/itinerary.service'
import { toastUtils } from '@/lib/toast-utils'

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  description?: string
  cover_photo_url?: string
}

interface Stop {
  id: string
  dayNumber: number
  date: string
  city: string
  country: string
  activities: Activity[]
}

interface Activity {
  id: string
  title: string
  startTime: string
  endTime: string
  type: 'ACTIVITY' | 'REST' | 'SLEEP' | 'GAP'
  description?: string
  estimatedCost?: number
}

export default function ItineraryView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [stops, setStops] = useState<Stop[]>([])
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadItinerary()
    }
  }, [id])

  const loadItinerary = async () => {
    try {
      const [tripData, daysData] = await Promise.all([
        tripService.getTripById(id!),
        itineraryService.getDays(id!)
      ])
      
      setTrip(tripData)
      
      // Load activities for each day
      const stopsWithActivities = await Promise.all(
        daysData.map(async (day) => {
          const blocks = await itineraryService.getBlocks(day.id)
          return {
            id: day.id,
            dayNumber: day.day_number,
            date: day.date,
            city: day.city || 'Unspecified',
            country: day.country || '',
            activities: blocks.map(block => ({
              id: block.id,
              title: block.title,
              startTime: block.start_time,
              endTime: block.end_time,
              type: block.block_type,
              description: block.description,
              estimatedCost: block.estimated_cost || 0
            })).sort((a, b) => a.startTime.localeCompare(b.startTime))
          }
        })
      )
      
      setStops(stopsWithActivities.sort((a, b) => a.dayNumber - b.dayNumber))
    } catch (error) {
      toastUtils.error('Failed to load itinerary')
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalCost = () => {
    return stops.reduce((total, stop) => 
      total + stop.activities.reduce((stopTotal, activity) => 
        stopTotal + (activity.estimatedCost || 0), 0
      ), 0
    )
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'ACTIVITY': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'REST': return 'bg-green-100 text-green-800 border-green-200'
      case 'SLEEP': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'GAP': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const ActivityBlock = ({ activity }: { activity: Activity }) => (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{activity.startTime} - {activity.endTime}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-medium">{activity.title}</h4>
          <Badge className={getActivityTypeColor(activity.type)}>
            {activity.type}
          </Badge>
        </div>
        {activity.description && (
          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
        )}
        {activity.estimatedCost && activity.estimatedCost > 0 && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <DollarSign className="h-4 w-4" />
            ${activity.estimatedCost}
          </div>
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading itinerary...</div>
  }

  if (!trip) {
    return <div className="container mx-auto px-4 py-8">Trip not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/trip/${id}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trip
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {trip.cover_photo_url && (
              <img
                src={trip.cover_photo_url}
                alt={trip.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {stops.length} stops
                </span>
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <DollarSign className="h-4 w-4" />
                  ${getTotalCost()} total
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/trip/${id}/builder`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        /* Calendar View - Day-wise layout */
        <Tabs defaultValue={stops[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-auto mb-6">
            {stops.map((stop) => (
              <TabsTrigger key={stop.id} value={stop.id} className="text-sm">
                Day {stop.dayNumber}
              </TabsTrigger>
            ))}
          </TabsList>

          {stops.map((stop) => (
            <TabsContent key={stop.id} value={stop.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <div className="flex items-center gap-2">
                        Day {stop.dayNumber}: {stop.city}
                        {stop.country && <span className="text-muted-foreground">, {stop.country}</span>}
                      </div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        {formatDate(stop.date)}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stop.activities.length > 0 ? (
                    <div className="space-y-4">
                      {stop.activities.map((activity) => (
                        <ActivityBlock key={activity.id} activity={activity} />
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Day Total:</span>
                          <span className="font-medium text-green-600">
                            ${stop.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto h-8 w-8 mb-2" />
                      <p>No activities planned for this day</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        /* List View - Grouped by cities */
        <div className="space-y-6">
          {stops.map((stop) => (
            <Card key={stop.id}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <div className="flex items-center gap-2">
                        Day {stop.dayNumber}: {stop.city}
                        {stop.country && <span className="text-muted-foreground">, {stop.country}</span>}
                      </div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        {formatDate(stop.date)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    ${stop.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stop.activities.length > 0 ? (
                  <div className="space-y-3">
                    {stop.activities.map((activity) => (
                      <ActivityBlock key={activity.id} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="mx-auto h-6 w-6 mb-2" />
                    <p className="text-sm">No activities planned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {stops.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No itinerary created yet</h3>
          <p className="text-muted-foreground mb-6">
            Start planning your trip by adding stops and activities
          </p>
          <Button onClick={() => navigate(`/trip/${id}/builder`)}>
            <Edit className="mr-2 h-4 w-4" />
            Start Planning
          </Button>
        </div>
      )}
    </div>
  )
}