import { SupabaseUserAdapter } from "@/infrastructure/adapters/supabase/supabase-user.adapter";
import { UserService } from "@/domain/services/user.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function userModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseUserAdapter(supabase);
  const userService = new UserService(repository, lang);
  
  return {
    userService
  };
}
