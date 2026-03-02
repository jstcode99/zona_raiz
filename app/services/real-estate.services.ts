import { cached } from "@/infrastructure/cache/cache";
import { unstable_cache } from "next/cache";
import { createRealEstateModule } from "@/application/containers/real-estate.container";
import { RealEstateFilters } from "@/domain/entities/real-estate.entity";


export const getRealEstateById = cached(
  async function (realEstateId: string) {
    const { useCases } = await createRealEstateModule()

    return useCases.getById(realEstateId);
  }
);

export const listRealEstates = cached(
  async (filters?: RealEstateFilters) => {
    const { useCases } = await createRealEstateModule()
    return useCases.all(filters);
  }
);
