import type { Middleware } from 'openapi-fetch'
import { normalizeApiError } from '../api/normalize-error'

export const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) return response

    const apiError = await normalizeApiError(response)

    throw apiError
  },
}
