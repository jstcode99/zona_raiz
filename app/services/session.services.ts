import { SupabaseProfileAdapter } from "@/domain/adapters/supabase/supabase-profile.adapter";
import { SupabaseSessionAdapter } from "@/domain/adapters/supabase/supabase-session.adapter";
import { GetProfileById } from "@/domain/use-cases/profile.cases";
import { cached } from "@/infrastructure/cache/cache";

export const getCurrentUser = cached(async function getCurrentUser() {
  const session = new SupabaseSessionAdapter();
  const userId = await session.getCurrentUserId();
  if (!userId) return null;

  const useCase = new GetProfileById(new SupabaseProfileAdapter());
  return useCase.execute(userId);
});