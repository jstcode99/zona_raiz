import * as yup from 'yup'
import { emailSchema } from '@/domain/entities/fields/emailSchema'

export const otpSchema = yup.object().shape({
  email: emailSchema,
})

export type OTPFormValues = yup.InferType<typeof otpSchema>
