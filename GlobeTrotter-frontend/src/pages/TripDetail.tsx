import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Plus, ArrowLeft, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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

interface ItineraryDay {
  id: string
  day_number: number
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

export default function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [days, setDays] = useState<ItineraryDay[]>([])
  const [selectedDayId, setSelectedDayId] = useState<string>('')
  const [blocks, setBlocks] = useState<ItineraryBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadTripData()
    }
  }, [id])

  useEffect(() => {
    if (selectedDayId) {
      loadBlocks(selectedDayId)
    }
  }, [selectedDayId])

  const loadTripData = async () => {
    try {
      const [tripData, daysData] = await Promise.all([
        tripService.getTripById(id!),
        itineraryService.getDays(id!)
      ])
      
      setTrip(tripData)
      setDays(daysData)
      
      // Auto-generate days if none exist
      if (daysData.length === 0) {
        await generateDays(tripData)
      } else {
        setSelectedDayId(daysData[0]?.id || '')
      }
    } catch (error) {
      toastUtils.error('Failed to load trip data')
      navigate('/trips')
    } finally {
      setIsLoading(false)
    }
  }

  const generateDays = async (tripData: Trip) => {
    try {
      const startDate = new Date(tripData.start_date)
      const endDate = new Date(tripData.end_date)
      const generatedDays: ItineraryDay[] = []
      
      let currentDate = new Date(startDate)
      let dayNumber = 1
      
      while (currentDate <= endDate) {
        const dayData = await itineraryService.createDay(id!, {
          dayNumber,
          date: currentDate.toISOString().split('T')[0],
          city: '',
          country: ''
        })
        
        generatedDays.push({
          id: dayData.id,
          day_number: dayNumber,
          date: currentDate.toISOString().split('T')[0],
        })
        
        currentDate.setDate(currentDate.getDate() + 1)
        dayNumber++
      }
      
      setDays(generatedDays)
      setSelectedDayId(generatedDays[0]?.id || '')
      toastUtils.success('Itinerary days created successfully!')
    } catch (error) {
      toastUtils.error('Failed to generate itinerary days')
    }
  }

  const loadBlocks = async (dayId: string) => {
    try {
      const blocksData = await itineraryService.getBlocks(dayId)
      setBlocks(blocksData)
    } catch (error) {
      toastUtils.error('Failed to load day activities')
    }
  }

  const addActivity = async () => {
    if (!selectedDayId) return
    
    try {
      const blockData = await itineraryService.createBlock(selectedDayId, {
        blockType: 'ACTIVITY',
        title: 'New Activity',
        description: 'Add details about this activity',
        startTime: '09:00',
        endTime: '10:00',
        estimatedCost: 0
      })
      
      // Reload blocks to show the new activity
      loadBlocks(selectedDayId)
      toastUtils.success('Activity added successfully!')
    } catch (error) {
      toastUtils.error('Failed to add activity')
    }
  }

  const formatTime = (time: string) => {
    return time // Already in HH:mm format
  }

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'ACTIVITY': return 'bg-blue-100 text-blue-800'
      case 'REST': return 'bg-green-100 text-green-800'
      case 'SLEEP': return 'bg-purple-100 text-purple-800'
      case 'GAP': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading trip details...</div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Trip not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/trips')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trips
        </Button>
        
        <div className="flex items-start gap-6">
          {trip.cover_photo_url && (
            <img
              src={trip.cover_photo_url}
              alt={trip.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
            <div className="flex items-center text-muted-foreground mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </div>
            {trip.description && (
              <p className="text-muted-foreground">{trip.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Days Tabs */}
      <Tabs value={selectedDayId} onValueChange={setSelectedDayId}>
        <TabsList className="grid w-full grid-cols-auto">
          {days.map((day) => (
            <TabsTrigger key={day.id} value={day.id}>
              Day {day.day_number}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent key={day.id} value={day.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Day {day.day_number} - {new Date(day.date).toLocaleDateString()}
                  </CardTitle>
                  <Button onClick={addActivity}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blocks.length > 0 ? (
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div key={block.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                          <Clock className="h-4 w-4" />
                          {formatTime(block.start_time)} - {formatTime(block.end_time)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{block.title}</h3>
                            <Badge className={getBlockTypeColor(block.block_type)}>
                              {block.block_type}
                            </Badge>
                          </div>
                          {block.description && (
                            <p className="text-sm text-muted-foreground mb-2">{block.description}</p>
                          )}
                          {block.estimated_cost && block.estimated_cost > 0 && (
                            <p className="text-sm font-medium">Cost: ${block.estimated_cost}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No activities planned</h3>
                    <p className="text-muted-foreground mb-6">
                      Start planning your day by adding activities
                    </p>
                    <Button onClick={addActivity}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Activity
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}