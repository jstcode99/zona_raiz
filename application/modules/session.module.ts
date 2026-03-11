import { SupabaseSessionAdapter } from "@/infrastructure/adapters/supabase/supabase-session.adapter";
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter";
import { SessionService } from "@/domain/services/session.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function sessionModule(lang: Lang) {
  const supabase = await SupabaseServerClient();
  const profileAdapter = new SupabaseProfileAdapter(supabase);
  const sessionAdapter = new SupabaseSessionAdapter(supabase, profileAdapter);
  const sessionService = new SessionService(sessionAdapter, profileAdapter, lang);
  
  return {
    sessionService
  };
}
