import { SupabaseUserAdapter } from "@/infrastructure/adapters/supabase/supabase-user.adapter";
import { UserService } from "@/domain/services/user.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function userModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseUserAdapter(supabase);
  const userService = new UserService(repository);
  
  return {
    userService
  };
}
