import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseUserAdapter } from "@/infrastructure/adapters/supabase/supabase-user.adapter"
import { UserUseCases } from "@/domain/use-cases/user.cases"

export async function createUserModule() {
  const supabase = await createSupabaseServerClient()

  const adapter = new SupabaseUserAdapter(supabase)
  const useCases = new UserUseCases(adapter)

  return { useCases }
}

