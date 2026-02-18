"use server";

import { ActionResult } from "@/shared/hooks/useServerMutation";
import { createRealEstateSchema } from "@/domain/entities/schemas/realEstateSchema";
import { SupabaseRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository";
import { revalidatePath } from "next/cache";

export async function createRealEstateAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries());

    const data = await createRealEstateSchema.validate(values, {
      abortEarly: false,
    });

    const repo = new SupabaseRealEstateRepository();
    await repo.create(data);

    revalidatePath("/dashboard/real-estates");

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
