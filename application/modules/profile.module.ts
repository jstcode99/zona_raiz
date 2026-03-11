import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter";
import { ProfileService } from "@/domain/services/profile.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function profileModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseProfileAdapter(supabase);
  const profileService = new ProfileService(repository);
  
  return {
    profileService
  };
}
