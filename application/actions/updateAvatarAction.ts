"use server"

import { ActionResult } from "@/shared/hooks/useServerMutation"
import { profileAvatarSchema } from "@/domain/entities/schemas/profile"
import { updateAvatar } from "../use-cases/updateAvatar"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"

export async function updateAvatarAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())
    const data = await profileAvatarSchema.validate(values)

    const avatar = data.avatar as File | null

    if (!avatar) {
      return {
        success: false, error: {
          message: "No se proporcionó un archivo de avatar",
        }
      }
    }
    const repo = new SupabaseProfileRepository()
    await updateAvatar(repo, { file: avatar })

    return { success: true }
  } catch (e: any) {
    return {
      success: false,
      error: {
        message: e.message ?? "No se pudo actualizar el avatar",
      },
    }
  }
}
