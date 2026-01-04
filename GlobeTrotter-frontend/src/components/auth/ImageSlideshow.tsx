import { useState, useEffect } from 'react'

const travelImages = [
  'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800', // Taj Mahal
  'https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg?auto=compress&cs=tinysrgb&w=800', // Kerala backwaters
  'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',   // Rajasthan palace
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800', // Goa beach
  'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800'  // Himalayas
]

const imageColors = [
  'rgb(59, 130, 246)',   // Blue
  'rgb(16, 185, 129)',   // Green
  'rgb(245, 101, 101)',  // Red
  'rgb(139, 92, 246)',   // Purple
  'rgb(251, 146, 60)'    // Orange
]

interface ImageSlideshowProps {
  onColorChange: (color: string) => void
}

export function ImageSlideshow({ onColorChange }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % travelImages.length
        onColorChange(imageColors[nextIndex])
        return nextIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [onColorChange])

  useEffect(() => {
    onColorChange(imageColors[currentIndex])
  }, [currentIndex, onColorChange])

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-900">
      {travelImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Travel destination ${index + 1}`}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.log('Image failed to load:', image)
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
      
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl font-bold mb-2">GlobeTrotter</div>
            <div className="text-lg">Loading amazing destinations...</div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-6 left-6 text-white z-10">
        <h2 className="text-3xl font-bold mb-2">Discover Amazing Places</h2>
        <p className="text-lg opacity-90">Start your journey with GlobeTrotter</p>
      </div>
      
      <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
        {travelImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              onColorChange(imageColors[index])
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}