"use server";

import { ActionResult } from "@/shared/hooks/useServerMutation";
import { revalidatePath } from "next/cache";
import { userRealStateAdminSchema } from "@/domain/entities/schemas/userProfileAdmin";
import { SupabaseUserRepository } from "@/infrastructure/db/SupabaseUserRepository";

export async function updateUserRealStateAdminAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries());

    const data = await userRealStateAdminSchema.validate(values, {
      abortEarly: false,
    });

    const { id, real_estate_id } = data;

    const repo = new SupabaseUserRepository();
    await repo.updateRealEstate(id, real_estate_id as string);

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);

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
