'use client'

import createClient from 'openapi-react-query'
import createFetchClient from 'openapi-fetch'
import { type paths } from '@/types/api/schema'

import { errorMiddleware } from '../middlewares/error.middleware'
import { authClientMiddleware } from '../middlewares/auth.client'
import { timeoutMiddleware } from '../middlewares/timeout'
import { zeroPathMiddleware } from '../middlewares/zero-path'
import { errorClientMiddleware } from '../middlewares/errors.client'

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
})

fetchClient.use(authClientMiddleware)
fetchClient.use(timeoutMiddleware)
fetchClient.use(zeroPathMiddleware)
fetchClient.use(errorClientMiddleware)
fetchClient.use(errorMiddleware)

export const $api = createClient(fetchClient)
