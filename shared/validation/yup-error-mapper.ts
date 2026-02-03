import { ValidationError } from "yup"
import { ServerError } from "../errors/server-error"

export function mapYupError(error: ValidationError): ServerError {
  const fieldErrors: Record<string, string[]> = {}

  error.inner.forEach((err) => {
    if (!err.path) return
    fieldErrors[err.path] ??= []
    fieldErrors[err.path].push(err.message)
  })

  return {
    code: "VALIDATION_ERROR",
    message: "Datos inválidos",
    fieldErrors,
  }
}