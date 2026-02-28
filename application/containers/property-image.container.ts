import { PropertyImageUseCases } from "@/domain/use-cases/property-image.cases"
import { SupabasePropertyImageAdapter } from "@/infrastructure/adapters/supabase/supabase-property-image.adapter"
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"

export async function createPropertyImageModule() {
  const supabase = await createSupabaseServerClient()

  const repository = new SupabasePropertyImageAdapter(supabase)
  const useCases = new PropertyImageUseCases(repository)

  return {
    repository,
    useCases,
  }
}