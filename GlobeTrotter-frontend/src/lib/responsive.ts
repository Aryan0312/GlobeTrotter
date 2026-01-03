// Tailwind breakpoints for consistent usage
export const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X large devices
}

// Responsive utility classes
export const responsive = {
  // Grid layouts
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2 md:grid-cols-3',
    desktop: 'lg:grid-cols-4 xl:grid-cols-5'
  },
  
  // Text sizes
  text: {
    heading: 'text-2xl sm:text-3xl lg:text-4xl',
    body: 'text-sm sm:text-base',
    caption: 'text-xs sm:text-sm'
  },
  
  // Spacing
  spacing: {
    section: 'py-8 sm:py-12 lg:py-16',
    container: 'px-4 sm:px-6 lg:px-8',
    gap: 'gap-4 sm:gap-6 lg:gap-8'
  },
  
  // Touch targets (minimum 44px)
  touch: {
    button: 'min-h-[44px] min-w-[44px] p-3',
    input: 'min-h-[44px] px-3 py-2'
  }
}