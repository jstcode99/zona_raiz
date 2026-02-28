import * as yup from "yup"

const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg"
]

function validateFile(file?: File) {
  if (!file) return true
  if (!SUPPORTED_TYPES.includes(file.type)) return false
  if (file.size > 5 * 1024 * 1024) return false
  return true
}

export const propertyImageSchema = yup.object({
  display_order: yup
    .number()
    .integer()
    .min(0)
    .default(0)
    .nullable(),

  is_primary: yup.boolean().default(false),

  alt_text: yup.string().max(120).nullable(),

  caption: yup.string().max(300).nullable(),

  file: yup
    .mixed<File>()
    .test("fileValidation", "invalidFile", validateFile)
    .required(),
})

export const propertyImageUpdateSchema = yup.object({
  display_order: yup
    .number()
    .typeError("display_order debe ser número")
    .optional(),

  is_primary: yup.boolean().optional(),

  alt_text: yup.string().nullable().optional(),

  caption: yup.string().nullable().optional(),
})

export type PropertyImageInput = yup.InferType<typeof propertyImageSchema>

export const defaultPropertyImageValues = {
  display_order: 0,
  is_primary: false,
  alt_text: "",
  caption: "",
}
