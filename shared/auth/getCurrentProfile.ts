import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"
import { getProfile } from "@/application/use-cases/getProfile"

export async function getCurrentProfile() {
  const repo = new SupabaseProfileRepository()
  return getProfile(repo)
}