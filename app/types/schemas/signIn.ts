import * as yup from 'yup'
import YupPassword from 'yup-password'
import { emailSchema } from '@/shared/schemas/fields/email'
import { passwordSchema } from '@/shared/schemas/fields/password'
YupPassword(yup)

export const signInSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
})
