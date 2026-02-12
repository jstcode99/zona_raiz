"use server"

import { ActionResult } from "@/shared/hooks/useServerMutation"
import { propertySchema } from "@/domain/entities/schemas/property"
import { Property } from "@/domain/entities/Property"
import { createPropertyUseCase } from "../use-cases/createPropertyUseCase"

export async function createPropertyAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries())

    const data = await propertySchema.validate(values, {
      abortEarly: false,
    })

    const useCase = new createPropertyUseCase()
    await useCase.execute(data as Omit<Property, "id">)

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