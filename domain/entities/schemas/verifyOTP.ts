import { emailSchema } from '@/domain/entities/fields/email'
import { otpSchema } from '@/domain/entities/fields/OTP'
import { typeSchema } from '@/domain/entities/fields/type'
import * as yup from 'yup'

export const verifyOTP = yup.object().shape({
  code: otpSchema,
  type: typeSchema,
  email: emailSchema,
})
