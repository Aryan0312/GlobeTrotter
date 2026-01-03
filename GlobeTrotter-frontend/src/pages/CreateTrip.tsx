import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Upload, Save, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toastUtils } from '@/lib/toast-utils'
import { uploadToCloudinary } from '@/services/cloudinary.service'
import { tripService } from '@/services/trip.service'

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return start <= end
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

type CreateTripFormData = z.infer<typeof createTripSchema>

export default function CreateTrip() {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  const form = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  })

  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toastUtils.error('File size must be less than 5MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toastUtils.error('Please select an image file')
        return
      }
      
      setCoverPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CreateTripFormData) => {
    setIsLoading(true)
    try {
      let coverPhotoUrl = ''
      
      // Upload cover photo to Cloudinary if provided
      if (coverPhoto) {
        setIsUploading(true)
        toastUtils.success('Uploading image...')
        coverPhotoUrl = await uploadToCloudinary(coverPhoto)
        setIsUploading(false)
      }

      // Create trip via API
      await tripService.createTrip({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        coverPhotoUrl,
      })
      
      toastUtils.success('Trip created successfully!')
      navigate('/trips')
    } catch (error) {
      toastUtils.error(error instanceof Error ? error.message : 'Failed to create trip')
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
        <p className="text-muted-foreground">
          Start planning your next adventure by providing some basic details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Trip Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Trip Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Summer Adventure in Europe"
                disabled={isLoading}
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  min={today}
                  disabled={isLoading}
                  {...form.register('startDate')}
                />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  disabled={isLoading}
                  {...form.register('endDate')}
                />
                {form.formState.errors.endDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Trip Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your trip plans, goals, or any special requirements..."
                rows={4}
                disabled={isLoading}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Cover Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="coverPhoto">Cover Photo (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {coverPhotoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={coverPhotoPreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCoverPhoto(null)
                          setCoverPhotoPreview(null)
                          // Reset file input
                          const fileInput = document.getElementById('coverPhoto') as HTMLInputElement
                          if (fileInput) fileInput.value = ''
                        }}
                        disabled={isLoading || isUploading}
                      >
                        Remove Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('coverPhoto')?.click()}
                        disabled={isLoading || isUploading}
                      >
                        Change Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Upload a cover photo for your trip
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max size: 5MB • Formats: JPG, PNG, GIF
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('coverPhoto')?.click()}
                        disabled={isLoading || isUploading}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
                <Input
                  id="coverPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  disabled={isLoading || isUploading}
                  className="hidden"
                />
              </div>
              {isUploading && (
                <p className="text-sm text-blue-600">Uploading image...</p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-8"
              >
                <Save className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : isLoading ? 'Creating Trip...' : 'Create Trip'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}