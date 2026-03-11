import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter";
import { OnboardingService } from "@/domain/services/onboarding.service";
import { SupabaseSessionAdapter } from "@/infrastructure/adapters/supabase/supabase-session.adapter";
import { Lang } from "@/i18n/settings";

export async function onboardingModule(lang: Lang) {
  const supabase = await SupabaseServerClient();
  const profileAdapter = new SupabaseProfileAdapter(supabase);
  const sessionAdapter = new SupabaseSessionAdapter(supabase, profileAdapter);

  const onboardingService = new OnboardingService(sessionAdapter, profileAdapter, lang);
  
  return {
    onboardingService
  };
}
