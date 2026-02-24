import { SupabaseProfileAdapter } from "@/domain/adapters/supabase/supabase-profile.adapter";
import { GetProfileById } from "@/domain/use-cases/profile.cases";
import { cached } from "@/infrastructure/cache/cache";

export const getProfile = cached(async function getProfile(userId: string) {
  const useCase = new GetProfileById(
     new SupabaseProfileAdapter()
  );
  return useCase.execute(userId);
});