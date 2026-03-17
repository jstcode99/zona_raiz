"use server"

import { cookies } from "next/headers"
import { ListingSearchFilters as ListingSearchFiltersType } from "@/features/listing/listing-search-filters"
import { ListingEntity } from "@/domain/entities/listing.entity"
import { pickDefined } from "@/lib/utils"
import { ListingSearchFilters } from "@/domain/services/listing.service"
import { appModule } from "@/application/modules/app.module"
import { Lang } from "@/i18n/settings"

export async function getListings(
  filters: ListingSearchFiltersType,
  lang: Lang
): Promise<{ listings: ListingEntity[]; total: number }> {
  const cookieStore = await cookies()
  const { listingService } = await appModule(lang, { cookies: cookieStore })

  const searchFilters: ListingSearchFilters = {
    listing_type: filters.listing_type,
    type: filters.type,
    country: filters.country,
    state: filters.state,
    city: filters.city,
    neighborhood: filters.neighborhood,
    min_price: filters.min_price,
    max_price: filters.max_price,
    min_bedrooms: filters.min_bedrooms,
    min_bathrooms: filters.min_bathrooms,
    q: filters.q,
    sort_by: filters.sort_by,
    page: filters.page,
    limit: filters.limit,
  }

  return listingService.searchWithCount(pickDefined(searchFilters))
}