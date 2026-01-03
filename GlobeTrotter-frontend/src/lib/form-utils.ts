import { z } from 'zod'
import { toast } from 'sonner'

// Common validation schemas
export const commonValidation = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  required: (field: string) => z.string().min(1, `${field} is required`),
  optionalString: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
}

// Form submission handler with loading state and toast feedback
export function createFormHandler<T>(
  onSubmit: (data: T) => Promise<void>,
  options?: {
    successMessage?: string
    errorMessage?: string
  }
) {
  return async (data: T, setLoading: (loading: boolean) => void) => {
    setLoading(true)
    try {
      await onSubmit(data)
      toast.success(options?.successMessage || 'Success!')
    } catch (error) {
      toast.error(options?.errorMessage || 'Something went wrong')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
}

// Form field wrapper with consistent styling
export const formFieldClasses = {
  container: 'space-y-2',
  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  error: 'text-sm font-medium text-destructive',
}