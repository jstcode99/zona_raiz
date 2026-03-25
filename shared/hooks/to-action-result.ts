import { ActionResult } from "./action-result";

type ValidationErrorLike = {
  name: string;
  path?: string;
  message: string;
  inner?: Array<{ path: string; message: string }>;
};

export function toActionResult<D>(error: unknown): ActionResult<D> {
  if (error && typeof error === "object" && "name" in error) {
    const err = error as ValidationErrorLike;

    if (err.name === "ValidationError") {
      if (err.inner?.length) {
        return {
          success: false,
          errors: err.inner.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        } as ActionResult<D>;
      }

      return {
        success: false,
        error: {
          field: err.path,
          message: err.message,
        },
      } as ActionResult<D>;
    }
  }

  const message =
    error instanceof Error ? error.message : "Unexpected error occurred";

  return {
    success: false,
    error: { message },
  } as ActionResult<D>;
}
