"use server";

import { SupabaseUserRepository } from "@/infrastructure/db/SupabaseUserRepository";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAdminAction(
  userId: string,
  realEstateId: string | null
): Promise<void> {
  try {
    const repo = new SupabaseUserRepository();
    await repo.updateRealEstate(userId, realEstateId);

    revalidatePath("/dashboard/users");
  } catch (e: any) {
    throw new Error(e.message ?? "Failed to update user real estate");
  }
}
