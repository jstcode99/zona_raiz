"use server";

import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { revalidatePath } from "next/cache";
import { realEstateSchema } from "@/domain/entities/schemas/real-estate.schema";
import { CreateRealEstate } from "@/domain/use-cases/create-real-estate.case";
import { SupabaseRealEstateAdapter } from "../supabase/supabase-real-state.adapter";

export async function createRealEstateAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData)
    
    const data = {
      name: rawData.name,
      description: rawData.description,
      whatsapp: rawData.whatsapp,
      address: typeof rawData.address === 'string'
        ? JSON.parse(rawData.address)
        : rawData.address,
    }

    const validated = await realEstateSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    })

    const useCase = new CreateRealEstate(
      new SupabaseRealEstateAdapter(),
    );

    await useCase.execute(validated);

    revalidatePath("/dashboard/my-real-estate")

    return { success: true }

  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error) {
      const err = error as { name: string; path?: string; message: string; errors?: string[] }

      if (err.name === "ValidationError") {
        return {
          success: false,
          error: {
            field: err.path,
            message: err.message,
          },
        }
      }
    }

    // Error genérico
    const message = error instanceof Error ? error.message : "Authentication failed"

    return {
      success: false,
      error: {
        message,
      },
    }
  }
}