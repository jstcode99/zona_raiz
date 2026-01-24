'use client'

import createClient from 'openapi-react-query'
import createFetchClient from 'openapi-fetch'
import { type paths } from '@/types/api/schema'
import {
  authClientMiddleware,
  errorClientMiddleware,
  timeoutMiddleware,
  zeroPathMiddleware,
} from '../middlewares/index'

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
})

fetchClient.use(authClientMiddleware)
fetchClient.use(timeoutMiddleware)
fetchClient.use(zeroPathMiddleware)
fetchClient.use(errorClientMiddleware)

export const $api = createClient(fetchClient)
