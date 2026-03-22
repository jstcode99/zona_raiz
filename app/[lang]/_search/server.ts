"use server";

import { cookies } from "next/headers";
import { ListingSearchFiltersInput as ListingSearchFiltersType } from "@/application/validation/listing-search-full.schema";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { pickDefined } from "@/lib/utils";
import { ListingSearchFilters } from "@/domain/ports/listing.port";
import { appModule } from "@/application/modules/app.module";
import { Lang } from "@/i18n/settings";

export async function getListings(
  filters: ListingSearchFiltersType,
  lang: Lang,
): Promise<{ listings: ListingEntity[]; total: number }> {
  const cookieStore = await cookies();
  const { listingService } = await appModule(lang, { cookies: cookieStore });

  const searchFilters: ListingSearchFilters = {
    listing_type: filters.listing_type,
    type: filters.type,
    state: filters.state,
    city: filters.city,
    neighborhood: filters.neighborhood,
    min_price: filters.min_price,
    max_price: filters.max_price,
    min_bedrooms: filters.min_bedrooms,
    min_bathrooms: filters.min_bathrooms,
    amenities: filters.amenities,
    q: filters.q,
    sort_by: filters.sort_by,
    page: filters.page,
    limit: filters.limit,
  };

  const clean = pickDefined(searchFilters);

  const isSimple =
    !filters.q &&
    !filters.min_price &&
    (!filters.max_price || filters.max_price >= 100000000) &&
    !filters.amenities?.length;

  if (isSimple) {
    return listingService.getCachedSearchWithCount(clean);
  }

  return listingService.searchWithCount(clean);
}
