import { last_nameSchema } from '@/shared/schemas/fields/last_name'
import { nameSchema } from '@/shared/schemas/fields/name'
import { phoneSchema } from '@/shared/schemas/fields/phone'
import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup)

export const accountSchema = yup.object().shape({
  name: nameSchema,
  last_name: last_nameSchema,
  phone: phoneSchema,
})
