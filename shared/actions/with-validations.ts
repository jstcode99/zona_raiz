import { AnyObjectSchema } from "yup"
import { ActionResult } from "./action-result"
import { mapYupError } from "../validation/yup-error-mapper"

export function withValidation<TInput, TOutput>(
  schema: AnyObjectSchema,
  handler: (input: TInput) => Promise<ActionResult<TOutput>>
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    try {
      const validated = await schema.validate(input, {
        abortEarly: false,
        stripUnknown: true,
      })

      return handler(validated)
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return {
          ok: false,
          error: mapYupError(error),
        }
      }
      throw error
    }
  }
}
