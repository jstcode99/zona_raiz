import * as yup from 'yup'
import { nameSchema } from '@/domain/entities/fields/name'
import { last_nameSchema } from '@/domain/entities/fields/last_name'
import { emailSchema } from '@/domain/entities/fields/email'
import { phoneSchema } from '@/domain/entities/fields/phone'
import { passwordSchema } from '@/domain/entities/fields/password'
import { password_confirmationSchema } from '@/domain/entities/fields/confirm_password'

export const signUpSchema = yup.object(
  {
    name: nameSchema,
    last_name: last_nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    password_confirmation: password_confirmationSchema,
    captchaToken: yup.string().nullable(),
  }
)

export type SignUpFormValues = yup.InferType<typeof signUpSchema>
