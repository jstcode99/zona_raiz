import * as yup from 'yup'
import YupPassword from 'yup-password'
import { emailSchema } from '@/domain/entities/fields/email'
import { passwordSchema } from '@/domain/entities/fields/password'
YupPassword(yup)

export const signInSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
})
