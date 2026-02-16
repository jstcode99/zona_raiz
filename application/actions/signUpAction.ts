"use server"

import { SupabaseAuthRepository } from "@/infrastructure/db/SupabaseAuthRepository"
import { ActionResult } from "@/shared/hooks/useServerMutation"
import { signUpSchema } from "@/domain/entities/schemas/signUp"

export async function signUpAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())

    const data = await signUpSchema.validate(values, {
      abortEarly: false,
    })

    const repo = new SupabaseAuthRepository()
    await repo.signUp(data)

    return { success: true }
  } catch (e: any) {
    if (e.name === "ValidationError") {
      return {
        success: false,
        error: {
          field: e.path,
          message: e.message,
        },
      }
    }

    return {
      success: false,
      error: {
        message: e.message ?? "Authentication failed",
      },
    }
  }
}