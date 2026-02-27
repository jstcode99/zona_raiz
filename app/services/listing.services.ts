import { cached } from "@/infrastructure/cache/cache";
import { createListingModule } from "@/application/containers/listing.container";
import { ListingFilters } from "@/domain/entities/listing.entity";

export const getListingById = cached(
  async function (id: string) {
    const { useCases } = await createListingModule()
    return useCases.findById(id);
  }
);

export const getActive = cached(
  async function () {
    const { useCases } = await createListingModule()
    return useCases.findActive();
  }
);

export const listListing = cached(
  async function (filters?: ListingFilters) {
    const { useCases } = await createListingModule()
    return useCases.all(filters);
  }
);
