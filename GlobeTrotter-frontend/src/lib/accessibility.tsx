import { cn } from '@/lib/utils'

// Skip to main content link for screen readers
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only',
        'absolute top-4 left-4 z-50',
        'bg-primary text-primary-foreground',
        'px-4 py-2 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-ring'
      )}
    >
      Skip to main content
    </a>
  )
}

// Accessible button with proper focus styles
export function AccessibleButton({ 
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
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Screen reader only text
export function ScreenReaderOnly({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Focus trap for modals/dialogs
export function useFocusTrap(isActive: boolean) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive || e.key !== 'Tab') return
    
    const modal = document.querySelector('[role="dialog"]')
    if (!modal) return
    
    const elements = modal.querySelectorAll(focusableElements) as NodeListOf<HTMLElement>
    const firstElement = elements[0]
    const lastElement = elements[elements.length - 1]
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }
  
  return { handleKeyDown }
}