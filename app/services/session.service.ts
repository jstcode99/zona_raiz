import { SupabaseProfileAdapter } from "@/domain/adapters/supabase/supabase-profile.adapter";
import { SupabaseSessionAdapter } from "@/domain/adapters/supabase/supabase-session.adapter";
import { GetProfileById } from "@/domain/use-cases/get-profile-by-id.case";
import { cached } from "@/infrastructure/cache/cache";

async function getCurrentUser() {
  const session = new SupabaseSessionAdapter();
  const userId = await session.getCurrentUserId();
  if (!userId) return null;

  const useCase = new GetProfileById(new SupabaseProfileAdapter());
  return useCase.execute(userId);
}

export const getCurrentUserCached = cached(getCurrentUser);