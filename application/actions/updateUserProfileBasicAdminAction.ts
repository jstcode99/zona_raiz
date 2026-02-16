"use server";

import { ActionResult } from "@/shared/hooks/useServerMutation";
import { revalidatePath } from "next/cache";
import { userProfileAdminSchema } from "@/domain/entities/schemas/userProfileAdmin";
import { SupabaseUserRepository } from "@/infrastructure/db/SupabaseUserRepository";

export async function updateUserProfileBasicAdminAction(
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const values = Object.fromEntries(formData.entries());

    const data = await userProfileAdminSchema.validate(values, {
      abortEarly: false,
    });

    const { id, ...updateData } = data;

    const repo = new SupabaseUserRepository();
    await repo.updateBasic(id, updateData);

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
