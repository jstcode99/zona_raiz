import * as yup from 'yup'
import { emailSchema } from '@/shared/schemas/fields/email'

export const schemaResetPasswordAttempt = yup.object().shape({
  email: emailSchema,
})