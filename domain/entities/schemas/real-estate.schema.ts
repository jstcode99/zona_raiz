import * as yup from 'yup'

import { nameSchema } from './base/name.schema'
import { descriptionSchema } from './base/description.schema'
import { whatsappSchema } from './base/whatsapp.schema'
import { addressSchema } from './base/address.schema'
import { avatarSchema } from './base/avatar.schema'

import i18next from 'i18next'

export const realEstateSchema = yup.object({
  name: nameSchema,
  description: descriptionSchema,
  whatsapp: whatsappSchema,
  address: addressSchema,
})

export const logoRealEstateSchema = yup.object({
  logo: avatarSchema
    .required(i18next.t('validations.required', {
      attribute: 'logo'
    })),
})

export type RealEstateFormValues = yup.InferType<typeof realEstateSchema>

export type LogoFormValues = yup.InferType<typeof logoRealEstateSchema>

export const defaultRealEstateValues = {
  name: 'Zona raiz',
  description: 'zona raiz colombia',
  whatsapp: '+57 3168314191',
  address: {
    street: 'Calle 40',
    city: 'Bogota',
    state: 'Bogota',
    postal_code: '50000',
    country: 'Colombia',
  }
}