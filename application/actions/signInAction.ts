"use server"

import { SupabaseAuthRepository } from "@/infrastructure/db/SupabaseAuthRepository"
import { signIn } from "../use-cases/signIn"
import { ActionResult } from "@/shared/hooks/useServerMutation"
import { signInSchema } from "@/domain/entities/schemas/signIn"

export async function signInAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())

    const data = await signInSchema.validate(values, {
      abortEarly: false,
    })

    const repo = new SupabaseAuthRepository()
    await signIn(repo, data.email, data.password as string)

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