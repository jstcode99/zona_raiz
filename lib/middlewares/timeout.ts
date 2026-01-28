'use client'

import { Middleware } from 'openapi-fetch'

export const timeoutMiddleware: Middleware = {
  onRequest({ request }) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 1000 * 60 * 5)

    const req = new Request(request, { signal: controller.signal })
    req.signal.addEventListener('abort', () => clearTimeout(id))
    return req
  },
}