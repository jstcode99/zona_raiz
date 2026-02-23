import * as yup from 'yup'
import { nameSchema } from '@/domain/entities/schemas/base/name.schema'
import { emailSchema } from '@/domain/entities/schemas/base/email.schema'
import { phoneSchema } from '@/domain/entities/schemas/base/phone.schema'
import { passwordSchema } from '@/domain/entities/schemas/base/password.schema'
import { password_confirmationSchema } from '@/domain/entities/schemas/base/confirm-password.schema'
import { typeRegisterSchema } from './base/type-register.schema'

export const signUpSchema = yup.object(
  {
    full_name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    password_confirmation: password_confirmationSchema,
    captchaToken: yup.string().nullable(),
    type_register: typeRegisterSchema,
  }
)

export type SignUpFormValues = yup.InferType<typeof signUpSchema>

export const defaultSignUpValues: SignUpFormValues = {
  full_name: 'juan sebastian',
  email: 'jstorres0211@gmail.com',
  phone: '+57 3168314191',
  password: 'wEUpZ#8RqT@ne-f',
  password_confirmation: 'wEUpZ#8RqT@ne-f',
  type_register: true
};