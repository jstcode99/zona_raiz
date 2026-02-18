import * as yup from 'yup'
import { nameSchema } from '@/domain/entities/fields/nameSchema'
import { emailSchema } from '@/domain/entities/fields/emailSchema'
import { phoneSchema } from '@/domain/entities/fields/phoneSchema'
import { passwordSchema } from '@/domain/entities/fields/passwordSchema'
import { password_confirmationSchema } from '@/domain/entities/fields/confirmPasswordSchema'

export const signUpSchema = yup.object(
  {
    full_name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    password_confirmation: password_confirmationSchema,
    captchaToken: yup.string().nullable(),
  }
)

export type SignUpFormValues = yup.InferType<typeof signUpSchema>
