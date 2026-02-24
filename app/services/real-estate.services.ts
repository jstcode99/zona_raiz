import { SupabaseRealEstateAdapter } from "@/domain/adapters/supabase/supabase-real-state.adapter";
import { GetRealEstateById, ListRealEstates } from "@/domain/use-cases/real-estate.cases";
import { cached } from "@/infrastructure/cache/cache";
import { unstable_cache } from "next/cache";

export const getRealEstateById = cached(
    async function (realEstateId: string) {
        const useCase = new GetRealEstateById(
            new SupabaseRealEstateAdapter()
        );
        return useCase.execute(realEstateId);
    }
);

export const listRealEstates = unstable_cache(
  async (filters?: Parameters<ListRealEstates['execute']>[0]) => {
    const useCase = new ListRealEstates(new SupabaseRealEstateAdapter());
    return useCase.execute(filters);
  },
  ["real-estates-list"],
  { tags: ["real-estates"] }
);
