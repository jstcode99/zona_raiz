"use server"

import { profileSchema } from "@/domain/entities/schemas/profileSchema"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"
import { ActionResult } from "@/shared/hooks/useServerMutation"
import { revalidatePath } from "next/cache"

const repo = new SupabaseProfileRepository()

export async function getProfileAction(): Promise<ActionResult & { data?: any }> {
  try {
    const profile = await repo.getCurrentProfile()
    return { success: true, data: profile }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to load profile",
      },
    }
  }
}

export async function updateProfileAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries())
    
    // Validar
    const data = await profileSchema.validate(rawData, {
      abortEarly: false,
      stripUnknown: true,
    })

    // Actualizar
    await repo.updateProfile({
      full_name: data.full_name,
      phone: data.phone || undefined,
    })

    // Revalidar cache
    revalidatePath("/dashboard/account")
    revalidatePath("/api/user") // Si tienes endpoint de user

    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ValidationError") {
      const err = error as { path?: string; message: string }
      return {
        success: false,
        error: {
          field: err.path,
          message: err.message,
        },
      }
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to update profile",
      },
    }
  }
}


export async function updateAvatarAction(formData: FormData): Promise<ActionResult & { url?: string }> {
  try {
    const file = formData.get("avatar") as File
    
    if (!file || file.size === 0) {
      return {
        success: false,
        error: { message: "No file provided" },
      }
    }

    const url = await repo.updateAvatar(file)
    
    revalidatePath("/dashboard/account")
    return { success: true, url }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to upload avatar",
      },
    }
  }
}