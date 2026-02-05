import { last_nameSchema } from '@/shared/schemas/fields/last_name'
import { nameSchema } from '@/shared/schemas/fields/name'
import { phoneSchema } from '@/shared/schemas/fields/phone'
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

export const accountSchema = yup.object().shape({
  name: nameSchema,
  last_name: last_nameSchema,
  phone: phoneSchema,
})

export const accountAvatarSchema = yup.object({
  avatar: yup
    .mixed()
    .required("Debes seleccionar una imagen")
    .test(
      "file-exists",
      "Debes seleccionar una imagen",
      (value) =>
        value &&
        typeof value === "object" &&
        "length" in value &&
        value.length === 1
    )
    .test(
      "file-size",
      "La imagen es demasiado grande",
      (value) => {
        if (!value || !("length" in value)) return false
        const fileList = value as FileList
        return fileList[0]?.size <= 2 * 1024 * 1024 // 2MB
      }
    )
    .test(
      "file-type",
      "Formato de imagen no válido",
      (value) => {
        if (!value || !("length" in value)) return false
        const fileList = value as FileList
        return ["image/jpeg", "image/png", "image/webp"].includes(
          fileList[0]?.type
        )
      }
    ),
})
export type AvatarFormValues = yup.InferType<typeof accountAvatarSchema>

