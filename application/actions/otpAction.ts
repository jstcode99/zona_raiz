"use server"

import { SupabaseAuthRepository } from "@/infrastructure/db/SupabaseAuthRepository"
import { ActionResult } from "@/shared/hooks/useServerMutation"
import { otpSchema } from "@/domain/entities/schemas/OTP"

export async function otpAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())

    const data = await otpSchema.validate(values, {
      abortEarly: false,
    })

    const repo = new SupabaseAuthRepository()
    await repo.otp(data.email)

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
        message: e.message ?? "Send otp failed",
      },
    }
  }
}