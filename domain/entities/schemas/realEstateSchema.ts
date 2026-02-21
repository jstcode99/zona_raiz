import * as yup from 'yup'
import { nameSchema } from '../fields/nameSchema'
import { descriptionSchema } from '../fields/descriptionSchema'
import { whatsappSchema } from '../fields/whatsapp'
import { addressSchema } from '../fields/addressSchema'
import { imageFileSchema } from '../fields/imageSchema'
import { idSchema } from '../fields/idSchema'

export const createRealEstateSchema = yup.object({
  name: nameSchema,
  description: descriptionSchema,
  whatsapp: whatsappSchema,
  logo: imageFileSchema,
  address: addressSchema,
})

export const updateRealEstateSchema = yup.object({
  id: idSchema,
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
  whatsapp: whatsappSchema.optional(),
  logo: imageFileSchema.optional(),
  address: addressSchema,
})


export type CreateRealEstateFormValues = yup.InferType<typeof createRealEstateSchema>
export type UpdateRealEstateFormValues = yup.InferType<typeof updateRealEstateSchema>


export const defaultRealEstateValues = {
  name: 'Zona raiz',
  description: 'zona raiz colombia',
  whatsapp: '+57 3168314191',
  logo: undefined,
  address: {
    street: 'Calle 40',
    city: 'Bogota',
    state: 'Bogota',
    postal_code: '50000',
    country: 'Colombia',
  }
}