import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseSessionAdapter } from "@/infrastructure/adapters/supabase/supabase-session.adapter"
import { SessionUseCases } from "@/domain/use-cases/session.use-cases"
import { createProfileRepository } from "@/infrastructure/factories/profile-repository.factory"

export async function createSessionModule() {
  const supabase = await createSupabaseServerClient()

  const profileRepository = createProfileRepository(supabase)

  const repository = new SupabaseSessionAdapter(
    supabase,
    profileRepository
  )

  const useCases = new SessionUseCases(repository)

  return { useCases }
}