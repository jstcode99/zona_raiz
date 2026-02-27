import { cached } from "@/infrastructure/cache/cache";
import { createPropertyModule } from "@/application/containers/property.container";
import { PropertyFilters } from "@/domain/entities/property.entity";

export const getPropertyById = cached(
  async function (id: string) {
    const { useCases } = await createPropertyModule()
    return useCases.getById(id);
  }
);

export const getPropertyBySlug = cached(
  async function (slug: string) {
    const { useCases } = await createPropertyModule()
    return useCases.getBySlug(slug);
  }
);

export const listProperties = cached(
  async function (filters?: PropertyFilters) {
    
    const { useCases } = await createPropertyModule()
    return useCases.all(filters);
  }
);

export const getPropertiesByRealEstate = cached(
  async function (realEstateId: string) {
    const { useCases } = await createPropertyModule()
    return useCases.getByRealEstate(realEstateId);
  }
);