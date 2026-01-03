import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { uploadToSupabase } from '@/services/cloudinary.service'
import { tripService } from '@/services/trip.service'

const editTripSchema = z.object({
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

type EditTripFormData = z.infer<typeof editTripSchema>

export default function EditTrip() {
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<EditTripFormData>({
    resolver: zodResolver(editTripSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  })

  useEffect(() => {
    if (id) {
      loadTripData()
    }
  }, [id])

  const loadTripData = async () => {
    try {
      const trip = await tripService.getTripById(id!)
      form.reset({
        name: trip.title,
        startDate: trip.start_date,
        endDate: trip.end_date,
        description: trip.description || '',
      })
      if (trip.cover_photo_url) {
        setExistingCoverUrl(trip.cover_photo_url)
        setCoverPhotoPreview(trip.cover_photo_url)
      }
    } catch (error) {
      toastUtils.error('Failed to load trip data')
      navigate('/trips')
    }
  }

  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastUtils.error('File size must be less than 5MB')
        return
      }
      
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

  const onSubmit = async (data: EditTripFormData) => {
    setIsLoading(true)
    try {
      let coverPhotoUrl = existingCoverUrl
      
      if (coverPhoto) {
        setIsUploading(true)
        toastUtils.success('Uploading image...')
        coverPhotoUrl = await uploadToSupabase(coverPhoto)
        setIsUploading(false)
      }

      await tripService.updateTrip(id!, {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        coverPhotoUrl,
      })
      
      toastUtils.success('Trip updated successfully!')
      navigate('/trips')
    } catch (error) {
      toastUtils.error(error instanceof Error ? error.message : 'Failed to update trip')
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Edit Trip</h1>
        <p className="text-muted-foreground">
          Update your trip details and make changes as needed.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your trip plans, goals, or any special requirements..."
                rows={4}
                disabled={isLoading}
                {...form.register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverPhoto">Cover Photo</Label>
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
                          setExistingCoverUrl(null)
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('coverPhoto')?.click()}
                      disabled={isLoading || isUploading}
                    >
                      Choose File
                    </Button>
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
            </div>

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
                {isUploading ? 'Uploading...' : isLoading ? 'Updating...' : 'Update Trip'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}