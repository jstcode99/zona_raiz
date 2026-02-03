import { emailSchema } from "@/shared/schemas/fields/email"
import { passwordSchema } from "@/shared/schemas/fields/password"
import * as yup from "yup"

export const signInSchema = yup.object({
  emailSchema,
  passwordSchema,
})
