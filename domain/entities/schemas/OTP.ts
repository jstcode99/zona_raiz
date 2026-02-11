import * as yup from 'yup'
import { emailSchema } from '@/domain/entities/fields/email'

export const otpSchema = yup.object().shape({
  email: emailSchema,
})
