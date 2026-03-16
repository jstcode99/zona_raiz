import { ListingSearchFilters as ListingSearchFiltersType } from "@/features/listing/listing-search-filters"
import { ListingEntity } from "@/domain/entities/listing.entity"
import { pickDefined } from "@/lib/utils"
import { ListingStatus } from "@/domain/entities/listing.enums"
import { ListingSearchFilters } from "@/domain/services/listing.service"
import { SearchPageClient } from "./search-page-client"
import { getTranslation } from "@/i18n/server"
import { Lang } from "@/i18n/settings"
import { cookies } from "next/headers"
import { appModule } from "@/application/modules/app.module"

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: { lang: Lang }
}

const sortOptions = [
  { label: "Más recientes", value: "created_at_desc" },
  { label: "Más antiguos", value: "created_at_asc" },
  { label: "Precio: menor a mayor", value: "price_asc" },
  { label: "Precio: mayor a menor", value: "price_desc" },
]

async function getListings(filters: ListingSearchFiltersType, lang: Lang): Promise<{ listings: ListingEntity[]; total: number }> {
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
    status: ListingStatus.DRAFT
  }

  return listingService.searchWithCount(pickDefined(searchFilters))
}

function parseSearchParams(sp: { [key: string]: string | string[] | undefined }): ListingSearchFiltersType {
  const amenities = sp.amenities ? String(sp.amenities).split(",").filter(Boolean) : []

  return {
    q: sp.q as string || "",
    listing_type: sp.listing_type as any || undefined,
    type: sp.type as string || undefined,
    country: sp.country as string || "",
    state: sp.state as string || "",
    city: sp.city as string || "",
    neighborhood: sp.neighborhood as string || "",
    street: sp.street as string || "",
    min_price: sp.min_price ? Number(sp.min_price) : 0,
    max_price: sp.max_price ? Number(sp.max_price) : 100000000,
    min_bedrooms: sp.min_bedrooms ? Number(sp.min_bedrooms) : undefined,
    min_bathrooms: sp.min_bathrooms ? Number(sp.min_bathrooms) : undefined,
    amenities: amenities.length > 0 ? amenities : [],
    sort_by: sp.sort_by as string || "created_at_desc",
    page: sp.page ? Number(sp.page) : 1,
    limit: sp.limit ? Number(sp.limit) : 12,
  }
}

export default async function page({
  searchParams,
  params
}: SearchPageProps) {
  const { lang } = await params;
  const { t } = await getTranslation(lang, ["sections"]);
  const query = await searchParams
  const filters = parseSearchParams(query)
  const { listings, total } = await getListings(filters, lang)

  const totalPages = Math.ceil(total / (filters.limit || 12))
  const currentPage = filters.page || 1

  const getBreadcrumb = () => {
    const parts = []
    if (filters.country) parts.push(filters.country)
    if (filters.state) parts.push(filters.state)
    if (filters.city) parts.push(filters.city)
    return parts.join(" > ") || t('all_properties')
  }

  return (
    <SearchPageClient
      filters={filters}
      listings={listings}
      total={total}
      totalPages={totalPages}
      currentPage={currentPage}
      sortOptions={sortOptions}
      breadcrumb={getBreadcrumb()}
    />
  )
}
