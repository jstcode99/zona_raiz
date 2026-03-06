import { createSupabaseAdminClient } from "@/infrastructure/db/supabase.server-admin"
import { SupabaseUserAdapter } from "@/infrastructure/adapters/supabase/supabase-user.adapter"
import { UserUseCases } from "@/domain/use-cases/user.cases"

export async function createUserModule() {
  const supabase = await createSupabaseAdminClient()

  const adapter = new SupabaseUserAdapter(supabase)
  const useCases = new UserUseCases(adapter)

  return { useCases }
}

