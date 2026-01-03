import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, MapPin, Calendar, Clock, GripVertical, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { tripService } from '@/services/trip.service'
import { itineraryService } from '@/services/itinerary.service'
import { toastUtils } from '@/lib/toast-utils'

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

export default function ItineraryBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<any>(null)
  const [stops, setStops] = useState<Stop[]>([])
  const [isAddStopOpen, setIsAddStopOpen] = useState(false)
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [selectedStopId, setSelectedStopId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [newStop, setNewStop] = useState({
    city: '',
    country: '',
    date: ''
  })
  const [newActivity, setNewActivity] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'ACTIVITY' as const,
    description: '',
    estimatedCost: 0
  })

  useEffect(() => {
    if (id) {
      loadTripData()
    }
  }, [id])

  const loadTripData = async () => {
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
            city: day.city || '',
            country: day.country || '',
            activities: blocks.map(block => ({
              id: block.id,
              title: block.title,
              startTime: block.start_time,
              endTime: block.end_time,
              type: block.block_type,
              description: block.description,
              estimatedCost: block.estimated_cost
            }))
          }
        })
      )
      
      setStops(stopsWithActivities)
    } catch (error) {
      toastUtils.error('Failed to load trip data')
    } finally {
      setIsLoading(false)
    }
  }

  const addStop = async () => {
    if (!newStop.city || !newStop.date) {
      toastUtils.error('City and date are required')
      return
    }

    try {
      const dayNumber = stops.length + 1
      const dayData = await itineraryService.createDay(id!, {
        dayNumber,
        date: newStop.date,
        city: newStop.city,
        country: newStop.country
      })

      const newStopData: Stop = {
        id: dayData.id,
        dayNumber,
        date: newStop.date,
        city: newStop.city,
        country: newStop.country,
        activities: []
      }

      setStops([...stops, newStopData])
      setNewStop({ city: '', country: '', date: '' })
      setIsAddStopOpen(false)
      toastUtils.success('Stop added successfully!')
    } catch (error) {
      toastUtils.error('Failed to add stop')
    }
  }

  const addActivity = async () => {
    if (!selectedStopId || !newActivity.title) {
      toastUtils.error('Activity title is required')
      return
    }

    try {
      const blockData = await itineraryService.createBlock(selectedStopId, {
        blockType: newActivity.type,
        title: newActivity.title,
        description: newActivity.description,
        startTime: newActivity.startTime,
        endTime: newActivity.endTime,
        estimatedCost: newActivity.estimatedCost
      })

      const activity: Activity = {
        id: blockData.id,
        title: newActivity.title,
        startTime: newActivity.startTime,
        endTime: newActivity.endTime,
        type: newActivity.type,
        description: newActivity.description,
        estimatedCost: newActivity.estimatedCost
      }

      setStops(stops.map(stop => 
        stop.id === selectedStopId 
          ? { ...stop, activities: [...stop.activities, activity].sort((a, b) => a.startTime.localeCompare(b.startTime)) }
          : stop
      ))

      setNewActivity({
        title: '',
        startTime: '09:00',
        endTime: '10:00',
        type: 'ACTIVITY',
        description: '',
        estimatedCost: 0
      })
      setIsAddActivityOpen(false)
      toastUtils.success('Activity added successfully!')
    } catch (error) {
      toastUtils.error('Failed to add activity')
    }
  }

  const deleteActivity = async (stopId: string, activityId: string) => {
    try {
      await itineraryService.deleteBlock(activityId)
      setStops(stops.map(stop => 
        stop.id === stopId 
          ? { ...stop, activities: stop.activities.filter(a => a.id !== activityId) }
          : stop
      ))
      toastUtils.success('Activity deleted successfully!')
    } catch (error) {
      toastUtils.error('Failed to delete activity')
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newStops = Array.from(stops)
    const [reorderedStop] = newStops.splice(result.source.index, 1)
    newStops.splice(result.destination.index, 0, reorderedStop)

    // Update day numbers
    const updatedStops = newStops.map((stop, index) => ({
      ...stop,
      dayNumber: index + 1
    }))

    setStops(updatedStops)
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'ACTIVITY': return 'bg-blue-100 text-blue-800'
      case 'REST': return 'bg-green-100 text-green-800'
      case 'SLEEP': return 'bg-purple-100 text-purple-800'
      case 'GAP': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Itinerary Builder</h1>
            <p className="text-muted-foreground">Plan your trip stops and activities</p>
          </div>
          <Dialog open={isAddStopOpen} onOpenChange={setIsAddStopOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Stop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stop</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={newStop.city}
                    onChange={(e) => setNewStop({...newStop, city: e.target.value})}
                    placeholder="e.g., Paris"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newStop.country}
                    onChange={(e) => setNewStop({...newStop, country: e.target.value})}
                    placeholder="e.g., France"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newStop.date}
                    onChange={(e) => setNewStop({...newStop, date: e.target.value})}
                  />
                </div>
                <Button onClick={addStop} className="w-full">Add Stop</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stops List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stops">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {stops.map((stop, index) => (
                <Draggable key={stop.id} draggableId={stop.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="overflow-hidden"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            </div>
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Day {stop.dayNumber}: {stop.city}
                                {stop.country && <span className="text-muted-foreground">, {stop.country}</span>}
                              </CardTitle>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="mr-1 h-4 w-4" />
                                {new Date(stop.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Dialog open={isAddActivityOpen && selectedStopId === stop.id} onOpenChange={(open) => {
                            setIsAddActivityOpen(open)
                            if (open) setSelectedStopId(stop.id)
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Activity
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Activity</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Activity Title *</Label>
                                  <Input
                                    value={newActivity.title}
                                    onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                                    placeholder="e.g., Visit Eiffel Tower"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Start Time</Label>
                                    <Input
                                      type="time"
                                      value={newActivity.startTime}
                                      onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label>End Time</Label>
                                    <Input
                                      type="time"
                                      value={newActivity.endTime}
                                      onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <Select value={newActivity.type} onValueChange={(value: any) => setNewActivity({...newActivity, type: value})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ACTIVITY">Activity</SelectItem>
                                      <SelectItem value="REST">Rest</SelectItem>
                                      <SelectItem value="SLEEP">Sleep</SelectItem>
                                      <SelectItem value="GAP">Gap</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                                    placeholder="Activity details..."
                                  />
                                </div>
                                <div>
                                  <Label>Estimated Cost ($)</Label>
                                  <Input
                                    type="number"
                                    value={newActivity.estimatedCost}
                                    onChange={(e) => setNewActivity({...newActivity, estimatedCost: Number(e.target.value)})}
                                  />
                                </div>
                                <Button onClick={addActivity} className="w-full">Add Activity</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {stop.activities.length > 0 ? (
                          <div className="space-y-3">
                            {stop.activities.map((activity) => (
                              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                                  <Clock className="h-4 w-4" />
                                  {activity.startTime} - {activity.endTime}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{activity.title}</h4>
                                    <Badge className={getActivityTypeColor(activity.type)}>
                                      {activity.type}
                                    </Badge>
                                  </div>
                                  {activity.description && (
                                    <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                                  )}
                                  {activity.estimatedCost && activity.estimatedCost > 0 && (
                                    <p className="text-sm font-medium">${activity.estimatedCost}</p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteActivity(stop.id, activity.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <MapPin className="mx-auto h-8 w-8 mb-2" />
                            <p>No activities planned for this stop</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {stops.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No stops added yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your itinerary by adding your first stop
          </p>
        </div>
      )}
    </div>
  )
}