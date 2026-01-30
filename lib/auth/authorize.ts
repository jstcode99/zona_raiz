import { getSession } from './session'
import { ApiError } from '@/lib/api/api-error'

export async function authorize(
  allowedRoles: Array<'admin' | 'agent'>,
) {
  const session = await getSession()

  if (!session) {
    throw new ApiError('UNAUTHORIZED', 'Not authenticated')
  }

  if (!allowedRoles.includes(session.role as 'admin' | 'agent')) {
    throw new ApiError('FORBIDDEN', 'Access denied')
  }

  return session
}