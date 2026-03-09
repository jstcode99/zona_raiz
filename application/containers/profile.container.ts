import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter"
import { ProfileUseCases } from "@/domain/use-cases/profile.cases"

export async function createProfileModule() {
  const supabase = await createSupabaseServerClient()

  const repository = new SupabaseProfileAdapter(supabase)
  const useCases = new ProfileUseCases(repository)

  return {
    repository,
    useCases,
  }
}