"use server";

import { SupabaseRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository";
import { revalidatePath } from "next/cache";

export async function deleteRealEstateAction(id: string): Promise<void> {
  try {
    const repo = new SupabaseRealEstateRepository();
    await repo.delete(id);

    revalidatePath("/dashboard/real-estates");
  } catch (e: any) {
    throw new Error(e.message ?? "Failed to delete real estate");
  }
}
