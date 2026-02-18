import * as yup from 'yup'
import YupPassword from 'yup-password'
import { emailSchema } from '@/domain/entities/fields/emailSchema'
import { passwordSchema } from '@/domain/entities/fields/passwordSchema'
YupPassword(yup)

export const signInSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInFormValues = yup.InferType<typeof signInSchema>
