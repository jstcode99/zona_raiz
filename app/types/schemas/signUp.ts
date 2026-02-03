import * as yup from 'yup'
import { nameSchema } from '@/shared/schemas/fields/name'
import { last_nameSchema } from '@/shared/schemas/fields/last_name'
import { emailSchema } from '@/shared/schemas/fields/email'
import { phoneSchema } from '@/shared/schemas/fields/phone'
import { passwordSchema } from '@/shared/schemas/fields/password'
import { password_confirmationSchema } from '@/shared/schemas/fields/confirm_password'

export const signUpSchema = yup.object().shape({
  name: nameSchema,
  last_name: last_nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  password_confirmation: password_confirmationSchema,
  captchaToken: yup.string().nullable(),
  // .required("Captcha requerido")
})