"use server";

import { SupabaseUserRepository } from "@/infrastructure/db/SupabaseUserRepository";
import { UserRole } from "@/domain/entities/Profile";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(
  userId: string,
  role: UserRole
): Promise<void> {
  try {
    const repo = new SupabaseUserRepository();
    await repo.updateRole(userId, role);

    revalidatePath("/dashboard/users");
  } catch (e: any) {
    throw new Error(e.message ?? "Failed to update user role");
  }
}
