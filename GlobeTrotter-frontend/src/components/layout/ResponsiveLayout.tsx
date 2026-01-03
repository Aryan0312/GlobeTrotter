import { cn } from '@/lib/utils'

// Responsive container with mobile-first breakpoints
export function Container({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      'w-full px-4 mx-auto',
      'sm:px-6 sm:max-w-screen-sm',
      'md:px-8 md:max-w-screen-md', 
      'lg:max-w-screen-lg',
      'xl:max-w-screen-xl',
      className
    )}>
      {children}
    </div>
  )
}

// Responsive grid with mobile-first columns
export function ResponsiveGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      'grid gap-4',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4',
      className
    )}>
      {children}
    </div>
  )
}

// Touch-friendly button wrapper
export function TouchButton({ 
  children, 
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      className={cn(
        'min-h-[44px] min-w-[44px]', // Touch target size
        'px-4 py-2',
        'touch-manipulation', // Disable double-tap zoom
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}