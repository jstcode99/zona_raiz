import { PropertyUseCases } from "@/domain/use-cases/property.cases"
import { SupabasePropertyAdapter } from "@/infrastructure/adapters/supabase/supabase-property.adapter"
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"

export async function createPropertyModule() {
  const supabase = await createSupabaseServerClient()

  const repository = new SupabasePropertyAdapter(supabase)
  const useCases = new PropertyUseCases(repository)

  return {
    repository,
    useCases,
  }
}