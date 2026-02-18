import { SupabaseAuthRepository } from "@/infrastructure/db/SupabaseAuthRepository"
import { redirect } from "next/navigation"

export default async function PostLoginPage() {
  const repo = new SupabaseAuthRepository()

  const realEstates = await repo.getRealStates()

  if (!realEstates || realEstates.length === 0) {
    redirect("post-login/real-estate-creation")
  }

  if (realEstates.length === 1) {
    redirect(`/dashboard/${realEstates[0].id}`)
  }

  redirect("dashboard/real-estate-selection")
}
