import { cached } from "@/infrastructure/cache/cache";
import { createListingModule } from "@/application/containers/listing.container";
import { ListingSearchFormInput } from "@/application/validation/listing-search.schema";

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
  async function (filters?: ListingSearchFormInput) {
    const { useCases } = await createListingModule()
    return useCases.all(filters);
  }
);
