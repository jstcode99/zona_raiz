"use server"

import { ActionResult } from "@/shared/hooks/useServerMutation"
import { propertySchemaUpdate } from "@/domain/entities/schemas/property"
import { SupabasePropertyRepository } from "@/infrastructure/db/SupabasePropertyRepository"
import { Property } from "@/domain/entities/Property"

export async function updatePropertyAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())

    const data = await propertySchemaUpdate.validate(values, {
      abortEarly: false,
    })

    const repo = new SupabasePropertyRepository()
    await repo.update(data as Partial<Property>)

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
        message: e.message ?? "An unexpected error occurred",
      },
    }
  }
}