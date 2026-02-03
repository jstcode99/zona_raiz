// shared/errors/action-wrapper.ts
import { ZodError } from "zod"
import { ActionResult } from "@/shared/actions/action-result"

export async function actionWrapper<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn()
    return { ok: true, data }
  } catch (error: any) {
    if (error instanceof ZodError) {
      return {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid data",
          fieldErrors: error.flatten().fieldErrors as any,
        },
      }
    }

    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message ?? "Unexpected error",
      },
    }
  }
}
