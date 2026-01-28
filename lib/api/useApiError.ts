import { ApiError } from './error'
import type { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'

interface ApiErrorOptions {
  setError?: UseFormSetError<any>
  onUnauthorized?: () => void
}

export function handleApiError(
  error: unknown,
  options?: ApiErrorOptions,
) {
  const apiError = error as ApiError

  if (apiError.code === 422 || apiError.code === 'VALIDATION_ERROR' && options?.setError) {
    Object.entries(apiError.fields ?? {}).forEach(([field, messages]) => {
      options.setError?.(field as any, {
        message: messages[0],
      })
    })
    return
  }

  if (apiError.code === 'UNAUTHORIZED') {
    toast.error(apiError.message)
    options?.onUnauthorized?.()
    return
  }

  toast.error(apiError.message)
}
