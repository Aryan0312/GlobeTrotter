import type { ReactNode } from 'react'
import type { FieldError } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldWrapperProps {
  label: string
  error?: FieldError
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormFieldWrapper({
  label,
  error,
  required,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}