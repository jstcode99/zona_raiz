import { nameSchema } from '@/domain/entities/fields/nameSchema'
import { phoneSchema } from '@/domain/entities/fields/phoneSchema'
import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup)

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]

export const profileSchema = yup.object({
  full_name: nameSchema,
  phone: phoneSchema,
})

export type ProfileFormValues = yup.InferType<typeof profileSchema>

export const defaultUserProfileValues = {
  full_name: "",
  phone: "",
}


export const profileAvatarSchema = yup.object({
  avatar: yup
    .mixed<File>()
    .nullable()
    .test("required", "Debes seleccionar una imagen", (value) => {
      return value instanceof File
    })
    .test("file-size", "La imagen es demasiado grande", (value) => {
      if (!value) return false
      return value.size <= MAX_FILE_SIZE
    })
    .test("file-type", "Formato de imagen no válido", (value) => {
      if (!value) return false
      return SUPPORTED_FORMATS.includes(value.type)
    }),
})
export type AvatarFormValues = yup.InferType<typeof profileAvatarSchema>

