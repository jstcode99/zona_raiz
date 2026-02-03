import * as yup from 'yup'
import { emailSchema } from '@/shared/schemas/fields/email'
import { typeSchema } from '@/shared/schemas/fields/type'

export const emailOTP = yup.object().shape({
  email: emailSchema,
  type: typeSchema
})
