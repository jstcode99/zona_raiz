'use server'

import { cookies } from 'next/headers'
import { ApiError } from '@/lib/api/api-error'
import { pathToTag } from '@/lib/cache/tags'
import type {
  PathWithMethod,
  ResponseBody,
} from '@/lib/api/openapi-helpers'

export async function serverQuery<
  P extends PathWithMethod<'get'>,
>(
  path: P,
): Promise<ResponseBody<P, 'get'>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}`,
    {
      headers: {
        Cookie: cookies().toString(),
      },
      next: {
        tags: [pathToTag(path)],
      },
    },
  )

  if (!res.ok) {
    let data: any = {}
    try {
      data = await res.json()
    } catch { }

    throw new ApiError(res.status, data.message)
  }

  return res.json()
}
