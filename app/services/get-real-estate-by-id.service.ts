import { SupabaseRealEstateAdapter } from "@/domain/adapters/supabase/supabase-real-state.adapter";
import { GetProfileById } from "@/domain/use-cases/get-profile-by-id.case";
import { GetRealEstateById } from "@/domain/use-cases/get-real-estate-by-id.case";
import { cached } from "@/infrastructure/cache/cache";

export async function getRealEstateById(realEstateId: string) {
  const useCase = new GetRealEstateById(
     new SupabaseRealEstateAdapter()
  );
  return useCase.execute(realEstateId);
}

export const getRealEstateCached = cached(getRealEstateById);