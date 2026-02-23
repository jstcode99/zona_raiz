import * as yup from 'yup'
import { emailSchema } from '@/domain/entities/schemas/base/email.schema'

export const otpSchema = yup.object().shape({
  email: emailSchema,
})

export type OTPFormValues = yup.InferType<typeof otpSchema>
