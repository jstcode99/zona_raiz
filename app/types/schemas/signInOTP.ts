import * as yup from 'yup'
import { emailSchema } from '@/shared/schemas/fields/email'

export const signInOtpSchema = yup.object().shape({
  email: emailSchema,
})
