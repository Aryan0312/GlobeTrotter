import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorBlockProps {
  title?: string
  message: string
  retry?: () => void
  variant?: 'default' | 'destructive'
}

export function ErrorBlock({ 
  title = 'Something went wrong', 
  message, 
  retry,
  variant = 'destructive' 
}: ErrorBlockProps) {
  return (
    <Alert variant={variant} className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm mt-1">{message}</div>
        </div>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}