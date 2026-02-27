import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { SupabaseSessionAdapter } from "@/infrastructure/adapters/supabase/supabase-session.adapter"
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter"
import { OnboardingUseCase } from "@/domain/use-cases/onboarding.cases"

export async function createOnboardingModule() {
  const supabase = await createSupabaseServerClient()

  const profileRepository = new SupabaseProfileAdapter(supabase)

  const sessionRepository = new SupabaseSessionAdapter(
    supabase,
    profileRepository
  )

  const useCases = new OnboardingUseCase(
    sessionRepository,
    profileRepository,
  )

  return { useCases }
}