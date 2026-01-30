'use server'

import { cookies } from 'next/headers'
import { ApiError } from '@/lib/api/api-error'
import { authorize } from '@/lib/auth/authorize'
import { invalidatePath } from '@/lib/cache/invalidate'
import type {
  HttpMethod,
  PathWithMethod,
  RequestBody,
  ResponseBody,
} from '@/lib/api/openapi-helpers'

export async function serverMutation<
  M extends Exclude<HttpMethod, 'get'>,
  P extends PathWithMethod<M>,
>(
  method: M,
  path: P,
  body: RequestBody<P, M>,
  invalidate?: PathWithMethod<'get'>[],
): Promise<ResponseBody<P, M>> {
  await authorize(['admin', 'agent'])

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}`,
    {
      method: method.toUpperCase(),
      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) {
    let data: any = {}
    try {
      data = await res.json()
    } catch {}

    throw new ApiError(
      res.status,
      data.message ?? 'Request failed',
      data.errors,
    )
  }

  const result = await res.json()

  invalidate?.forEach(invalidatePath)

  return result
}
