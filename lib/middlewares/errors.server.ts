import 'server-only'
import { Middleware } from 'openapi-fetch'

export const errorServerMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      console.error(
        `[API ERROR] ${response.status} ${response.statusText}`,
      )
    }
    return response
  },
}
