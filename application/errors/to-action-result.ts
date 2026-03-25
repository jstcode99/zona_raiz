import { ActionResult } from "@/shared/hooks/action-result";
import { AppError } from "../errors/app.error";

export function toActionResult(error: unknown): ActionResult {
  if (error instanceof AppError) {
    if (error.issues?.length) {
      return {
        success: false,
        errors: error.issues,
      };
    }

    return {
      success: false,
      error: { message: error.message },
    };
  }

  // fallback Yup legacy
  if (error && typeof error === "object" && "name" in error) {
    const err: any = error;

    if (err.name === "ValidationError") {
      return {
        success: false,
        error: {
          field: err.path,
          message: err.message,
        },
      };
    }
  }

  return {
    success: false,
    error: {
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    },
  };
}
