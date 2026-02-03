import { emailSchema } from '@/shared/schemas/fields/email'
import { nameSchema } from '@/shared/schemas/fields/name'
import * as yup from 'yup'

export const createUserSchema = yup.object({
  email: emailSchema,
  name: nameSchema,
})

export type CreateUserSchema = yup.InferType<typeof createUserSchema>