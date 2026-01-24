import { Middleware } from 'openapi-fetch'

export const zeroPathMiddleware: Middleware = {
  onRequest({ params, request }) {
    const values = Object.values(params?.path ?? {})
    return values.some(v => v === 0)
      ? Response.json(null)
      : request
  },
}
