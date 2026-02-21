import * as yup from 'yup'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]


export const avatarSchema = yup
    .mixed<File>()
    .test("fileSize", "logo.size", (file) => {
      if (!file || !(file instanceof File)) return true // Skip if no file
      return file.size <= MAX_FILE_SIZE
    })
    .test("fileType", "logo.type", (file) => {
      if (!file || !(file instanceof File)) return true // Skip if no file
      return SUPPORTED_FORMATS.includes(file.type)
    })