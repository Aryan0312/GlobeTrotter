import { toast } from 'sonner'

export const toastUtils = {
  success: (message: string) => {
    toast.success(message)
  },
  
  error: (message: string = 'Something went wrong') => {
    toast.error(message)
  },
  
  loading: (message: string = 'Loading...') => {
    return toast.loading(message)
  },
  
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, messages)
  },
  
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId)
  },
}