import { AppError } from "./app.error"

export function handleError(error: any): never {
  // Yup
  if (error?.name === "ValidationError") {
    if (error.inner?.length) {
      throw new AppError(
        "Validation failed",
        "VALIDATION",
        422,
        error.inner.map((e: any) => ({
          field: e.path,
          message: e.message,
        }))
      )
    }

    throw new AppError(error.message, "VALIDATION", 422, [
      { field: error.path, message: error.message },
    ])
  }

  // Supabase / Postgres
  switch (error?.code) {
    case "42501":
      throw new AppError("No autorizado", "RLS", 403)

    case "23505":
      throw new AppError("Registro duplicado", "CONFLICT", 409)

    case "PGRST116":
      throw new AppError("No encontrado", "NOT_FOUND", 404)
  }

  if (error instanceof AppError) throw error

  throw new AppError(
    error?.message ?? "Error inesperado",
    "UNKNOWN",
    500
  )
}