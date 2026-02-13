"use server"

import { ActionResult } from "@/shared/hooks/useServerMutation"
import { profileSchema } from "@/domain/entities/schemas/profile"
import { revalidatePath } from "next/cache"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"

export async function updateProfileAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())

    const data = await profileSchema.validate(values, {
      abortEarly: false,
    })

    const repo = new SupabaseProfileRepository()
    await repo.updateProfile(data)

    revalidatePath('/', 'layout');

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