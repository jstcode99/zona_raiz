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
  address: addressSchema,
  logo: imageFileSchema
})

export const updateRealEstateSchema = yup.object({
  id: idSchema,
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
  whatsapp: whatsappSchema.optional(),
  address: addressSchema.optional(),
  logo: imageFileSchema.optional()
})

export const deleteRealEstateSchema = yup.object({
  id: idSchema
})

export type CreateRealEstateInput = yup.InferType<typeof createRealEstateSchema>
export type UpdateRealEstateInput = yup.InferType<typeof updateRealEstateSchema>
export type DeleteRealEstateInput = yup.InferType<typeof deleteRealEstateSchema>


export const defaultRealEstateValues = {
  name: '',
  description: '',
  whatsapp: '',
  address: '',
  logo: null
}