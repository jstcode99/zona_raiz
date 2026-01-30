'use client'

import { useState } from 'react'
import { ApiError } from '@/lib/api/api-error'
import { serverMutation } from '@/app/actions/server-mutation'
import type {
  HttpMethod,
  PathWithMethod,
  RequestBody,
  ResponseBody,
} from '@/lib/api/openapi-helpers'

export function useServerMutation<
  M extends Exclude<HttpMethod, 'get'>,
  P extends PathWithMethod<M>,
>() {
  const [data, setData] = useState<ResponseBody<P, M> | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [status, setStatus] =
    useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const mutate = async (
    method: M,
    path: P,
    body: RequestBody<P, M>,
    invalidate?: PathWithMethod<'get'>[],
  ) => {
    setStatus('loading')
    setError(null)

    try {
      const result = await serverMutation(
        method,
        path,
        body,
        invalidate,
      )

      setData(result)
      setStatus('success')
      return result
    } catch (err) {
      setError(err as ApiError)
      setStatus('error')
      throw err
    }
  }

  return {
    mutate,
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
  }
}
