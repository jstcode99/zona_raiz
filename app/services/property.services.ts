import { SupabasePropertyAdapter } from "@/domain/adapters/supabase/supabase-property.adapter";
import {
  ListProperties,
  GetPropertyById
} from "@/domain/use-cases/property.cases";
import { cached } from "@/infrastructure/cache/cache";

// Queries con cache
export const getPropertyById = cached(
  async (id: string) => {
    const useCase = new GetPropertyById(new SupabasePropertyAdapter());
    return useCase.execute(id);
  },
);

export const getPropertyBySlug = cached(
  async (slug: string) => {
    const adapter = new SupabasePropertyAdapter();
    return adapter.getBySlug(slug);
  },
);

export const listProperties = cached(
  async (filters?: Parameters<ListProperties['execute']>[0]) => {
    const useCase = new ListProperties(new SupabasePropertyAdapter());
    return useCase.execute(filters);
  }
);

export const getPropertiesByRealEstate = cached(
  async (realEstateId: string) => {
    const adapter = new SupabasePropertyAdapter();
    return adapter.getByRealEstate(realEstateId);
  }
);
