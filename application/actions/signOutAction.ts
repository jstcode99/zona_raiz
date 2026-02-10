"use server"

import { SupabaseAuthRepository } from "@/infrastructure/db/SupabaseAuthRepository"
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  const repo = new SupabaseAuthRepository()
  await repo.signOut()
  revalidatePath('/', 'layout');
}
