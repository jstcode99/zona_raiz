import type { UseMutationOptions } from '@tanstack/react-query'
import { handleApiError } from './useApiError'
import type { ApiError } from './error'

export function useApiMutation<TData, TVariables>(
  mutation: () => ReturnType<any>,
  options?: UseMutationOptions<TData, ApiError, TVariables> & {
    setFormError?: any
  },
) {
  const mutationResult = mutation()

  return {
    ...mutationResult,
    mutate: (variables: TVariables) =>
      mutationResult.mutate(variables, {
        onError: (error) => {
          handleApiError(error, {
            setError: options?.setFormError,
          })
          options?.onError?.(error)
        },
        onSuccess: options?.onSuccess,
      }),
  }
}
