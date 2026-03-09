import { RealEstateUseCases } from "@/domain/use-cases/real-estate.cases"
import { SupabaseRealEstateAdapter } from "@/infrastructure/adapters/supabase/supabase-real-state.adapter"
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"

export async function createRealEstateModule() {
  const supabase = await createSupabaseServerClient()

  const repository = new SupabaseRealEstateAdapter(supabase)
  const useCases = new RealEstateUseCases(repository)

  return {
    repository,
    useCases,
  }
}