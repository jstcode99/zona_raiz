import { SupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/supabase/supabase-auth.adapter"
import { AuthService } from "@/domain/services/auth.service"
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter"

export async function authModule() {
  const supabase = await SupabaseServerClient()
  const authAdapter = new SupabaseAuthAdapter(supabase)
  const profileAdapter = new SupabaseProfileAdapter(supabase)
  
  const authService = new AuthService(
    authAdapter,
    profileAdapter
  )

  return { authService }
}