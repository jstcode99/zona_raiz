"use server";

import { ActionResult } from "@/shared/hooks/useServerMutation";
import { createRealEstateSchema, updateRealEstateSchema } from "@/domain/entities/schemas/realEstateSchema";
import { SupabaseRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository";
import { revalidatePath } from "next/cache";

export async function createRealEstateAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData)

    const data = {
      name: rawData.name,
      description: rawData.description,
      whatsapp: rawData.whatsapp,
      logo: rawData.logo,
      address: typeof rawData.address === 'string'
        ? JSON.parse(rawData.address)
        : rawData.address,
    }

    const validated = await createRealEstateSchema.validate(data, {
      abortEarly: false
    })

    const repo = new SupabaseRealEstateRepository()
    await repo.create(validated)

    revalidatePath("/dashboard/real-estates")

    return { success: true }
  } catch (e: any) {
    console.error("Server action error:", e)

    if (e.name === "ValidationError") {
      // Si hay múltiples errores, tomar el primero
      const firstError = e.inner?.[0] || e
      return {
        success: false,
        error: {
          field: firstError.path,
          message: firstError.message,
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
export async function updateRealEstateAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData);

    const validate = await updateRealEstateSchema.validate(rawData, {
      abortEarly: false,
    });

    const data = {
      ...validate,
      address: JSON.parse(rawData.address as string),
    }

    const { id } = data

    const repo = new SupabaseRealEstateRepository();
    await repo.update(id, data);

    revalidatePath("/dashboard/real-estates");
    revalidatePath(`/dashboard/real-estates/${id}`);

    return { success: true };
  } catch (e: any) {
    if (e.name === "ValidationError") {
      return {
        success: false,
        error: {
          field: e.path,
          message: e.message,
        },
      };
    }

    return {
      success: false,
      error: {
        message: e.message ?? "An unexpected error occurred",
      },
    };
  }
}

export async function deleteRealEstateAction(id: string): Promise<void> {
  try {
    const repo = new SupabaseRealEstateRepository();
    await repo.delete(id);

    revalidatePath("/dashboard/real-estates");
  } catch (e: any) {
    throw new Error(e.message ?? "Failed to delete real estate");
  }
}
