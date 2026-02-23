import * as yup from 'yup'
import YupPassword from 'yup-password'
import { emailSchema } from './base/email.schema'
import { passwordSchema } from './base/password.schema'
YupPassword(yup)

export const signInSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInFormValues = yup.InferType<typeof signInSchema>

export const defaultSignInValues: SignInFormValues = {
  email: '',
  password: '',
};