'use client'

import { Middleware } from 'openapi-fetch'
import { ApiPaths } from '@/types/api/schema'
import { getCurrentAccessToken, refreshToken } from '@/lib/js-cookie'

const UNPROTECTED_ROUTES = [
  ApiPaths.signIn,
  ApiPaths.signInSocial,
  ApiPaths.signUp,
  ApiPaths.signOut,
]

export const authClientMiddleware: Middleware = {
  onRequest({ schemaPath, request }) {
    if (
      schemaPath &&
      UNPROTECTED_ROUTES.some(p => schemaPath.startsWith(p))
    ) {
      request.headers.delete('Authorization')
      return request
    }

    const token = getCurrentAccessToken()
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }

    return request
  },

  async onResponse({ request, response }) {
    if (response.status !== 401) return response

    const token = await refreshToken()
    if (!token) return response

    request.headers.set('Authorization', `Bearer ${token}`)
    return fetch(request)
  },
}
