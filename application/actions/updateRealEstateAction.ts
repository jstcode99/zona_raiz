"use server";

import { ActionResult } from "@/shared/hooks/useServerMutation";
import { realEstateUpdateSchema } from "@/domain/entities/schemas/realEstate";
import { SupabaseRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository";
import { revalidatePath } from "next/cache";

export async function updateRealEstateAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries());

    const data = await realEstateUpdateSchema.validate(values, {
      abortEarly: false,
    });

    const { id, ...updateData } = data;

    const repo = new SupabaseRealEstateRepository();
    await repo.update(id, updateData);

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
