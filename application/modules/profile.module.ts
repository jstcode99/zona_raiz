import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter";
import { ProfileService } from "@/domain/services/profile.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function profileModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseProfileAdapter(supabase);
  const profileService = new ProfileService(repository, lang);
  
  return {
    profileService
  };
}
