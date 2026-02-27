import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/supabase/supabase-auth.adapter"
import { AuthUseCases } from "@/domain/use-cases/auth.cases"
import { createProfileModule } from "./profile.container"

export async function createAuthModule() {
  const supabase = await createSupabaseServerClient()

  const authAdapter = new SupabaseAuthAdapter(supabase)
  const profileModule = await createProfileModule()

  const useCases = new AuthUseCases(
    authAdapter,
    profileModule.useCases
  )

  return { useCases }
}