import 'server-only'

import createFetchClient from 'openapi-fetch'
import { type paths } from '@/types/api/schema'
import { authServerMiddleware } from '../middlewares/auth.server'
import { errorServerMiddleware } from '../middlewares/errors.server'


export const createServerApi = () => {
  const client = createFetchClient<paths>({
    baseUrl: process.env.API_URL!,
  })

  client.use(authServerMiddleware)
  client.use(errorServerMiddleware)

  return client
}
