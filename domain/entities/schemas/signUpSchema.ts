import * as yup from 'yup'
import { nameSchema } from '@/domain/entities/fields/nameSchema'
import { emailSchema } from '@/domain/entities/fields/emailSchema'
import { phoneSchema } from '@/domain/entities/fields/phoneSchema'
import { passwordSchema } from '@/domain/entities/fields/passwordSchema'
import { password_confirmationSchema } from '@/domain/entities/fields/confirmPasswordSchema'
import { typeRegisterSchema } from '../fields/typeRegisterSchema'

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