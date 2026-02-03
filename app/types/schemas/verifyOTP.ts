import { emailSchema } from '@/shared/schemas/fields/email'
import { otpSchema } from '@/shared/schemas/fields/OTP'
import { typeSchema } from '@/shared/schemas/fields/type'
import * as yup from 'yup'

export const verifyOTP = yup.object().shape({
  code: otpSchema,
  type: typeSchema,
  email: emailSchema,
})
