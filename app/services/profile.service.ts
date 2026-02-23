import { SupabaseProfileAdapter } from "@/domain/adapters/supabase/supabase-profile.adapter";
import { GetProfileById } from "@/domain/use-cases/get-profile-by-id.case";
import { cached } from "@/infrastructure/cache/cache";

export async function getProfile(userId: string) {
  const useCase = new GetProfileById(
     new SupabaseProfileAdapter()
  );
  return useCase.execute(userId);
}

export const getProfileCached = cached(getProfile);