'use client'

import { Middleware } from 'openapi-fetch'
import { toast } from 'sonner'
import { showFetchError } from '@/lib/js-cookie'

export const errorClientMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok && response.status !== 401) {
      await showFetchError(response)
    }
    return response
  },

  onError({ error }) {
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      toast.error('No se pudo conectar con el servidor')
      return Response.json(null)
    }
  },
}
