import 'server-only'

import createFetchClient from 'openapi-fetch'
import { type paths } from '@/types/api/schema'
import {
  authServerMiddleware,
  timeoutMiddleware,
  zeroPathMiddleware,
  errorServerMiddleware,
} from '../middlewares/index'

export const createServerApi = () => {
  const client = createFetchClient<paths>({
    baseUrl: process.env.API_URL!,
  })

  client.use(authServerMiddleware)
  client.use(timeoutMiddleware)
  client.use(zeroPathMiddleware)
  client.use(errorServerMiddleware)

  return client
}
