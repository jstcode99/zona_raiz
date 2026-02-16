"use server";

import { SupabaseUserRepository } from "@/infrastructure/db/SupabaseUserRepository";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(userId: string): Promise<void> {
  try {
    const repo = new SupabaseUserRepository();
    await repo.delete(userId);

    revalidatePath("/dashboard/users");
  } catch (e: any) {
    throw new Error(e.message ?? "Failed to delete user");
  }
}
