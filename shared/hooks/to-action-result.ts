import { ActionResult } from "./use-server-mutation.hook"

type ValidationErrorLike = {
  name: string
  path?: string
  message: string
  inner?: Array<{ path: string; message: string }>
}

export function toActionResult(error: unknown): ActionResult {
  if (error && typeof error === "object" && "name" in error) {
    const err = error as ValidationErrorLike

    if (err.name === "ValidationError") {
      if (err.inner?.length) {
        return {
          success: false,
          errors: err.inner.map(e => ({
            field: e.path,
            message: e.message,
          })),
        }
      }

      return {
        success: false,
        error: {
          field: err.path,
          message: err.message,
        },
      }
    }
  }

  const message =
    error instanceof Error
      ? error.message
      : "Unexpected error occurred"

  return {
    success: false,
    error: { message },
  }
}