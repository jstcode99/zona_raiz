import 'server-only'
import { Middleware } from 'openapi-fetch'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ApiPaths } from '@/types/api/schema'

const UNPROTECTED_ROUTES = [
  ApiPaths.signIn,
  ApiPaths.signInSocial,
  ApiPaths.signUp,
]

export const authServerMiddleware: Middleware = {
  onRequest({ schemaPath, request }) {
    if (
      schemaPath &&
      UNPROTECTED_ROUTES.some(p => schemaPath.startsWith(p))
    ) {
      return request
    }

    const token = cookies().get('accessToken')?.value
    if (!token) {
      redirect('/sign-in')
    }

    request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
}
