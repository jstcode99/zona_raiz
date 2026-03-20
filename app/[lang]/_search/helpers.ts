import { ListingSearchFiltersInput as ListingSearchFiltersType } from "@/application/validation/listing-search-full.schema"
import { Lang } from "@/i18n/settings"
export const parseLocation = (location?: string[]): {
    country: string
    state: string
    city: string
} => {
    return {
        country: location?.[0] ?? "",
        state: location?.[1] ?? "",
        city: location?.[2] ?? "",
    }
}

export const parseSearchParams = (
    sp: { [key: string]: string | string[] | undefined },
    location?: string[]
): ListingSearchFiltersType => {
    const { country, state, city } = parseLocation(location)
    const amenities = sp.amenities ? String(sp.amenities).split(",").filter(Boolean) : []

    return {
        q: (sp.q as string) || "",
        listing_type: (sp.listing_type as any) || undefined,
        type: (sp.type as string) || undefined,
        country,
        state,
        city,
        neighborhood: (sp.neighborhood as string) || "",
        street: (sp.street as string) || "",
        min_price: sp.min_price ? Number(sp.min_price) : 0,
        max_price: sp.max_price ? Number(sp.max_price) : 100000000,
        min_bedrooms: sp.min_bedrooms ? Number(sp.min_bedrooms) : undefined,
        min_bathrooms: sp.min_bathrooms ? Number(sp.min_bathrooms) : undefined,
        amenities: amenities.length > 0 ? amenities : [],
        sort_by: (sp.sort_by as string) || "created_at_desc",
        page: sp.page ? Number(sp.page) : 1,
        limit: sp.limit ? Number(sp.limit) : 12,
    }
}

export const buildUrl = (overrides: Partial<ListingSearchFiltersType> = {}, basePath: string, filters: Partial<ListingSearchFiltersType>) => {
    const merged = { ...filters, ...overrides }
    const params = new URLSearchParams()

    // Solo search params, NO location
    if (merged.q) params.set("q", merged.q)
    if (merged.listing_type) params.set("listing_type", merged.listing_type)
    if (merged.type) params.set("type", merged.type)
    if (merged.neighborhood) params.set("neighborhood", merged.neighborhood)
    if (merged.min_price && merged.min_price > 0) params.set("min_price", String(merged.min_price))
    if (merged.max_price && merged.max_price < 100000000) params.set("max_price", String(merged.max_price))
    if (merged.min_bedrooms) params.set("min_bedrooms", String(merged.min_bedrooms))
    if (merged.min_bathrooms) params.set("min_bathrooms", String(merged.min_bathrooms))
    if (merged.amenities?.length) params.set("amenities", merged.amenities.join(","))
    if (merged.sort_by && merged.sort_by !== "created_at_desc") params.set("sort_by", merged.sort_by)
    if (merged.page && merged.page > 1) params.set("page", String(merged.page))

    const qs = params.toString()
    return `${basePath}${qs ? `?${qs}` : ""}`
}

export const buildCanonicalUrl =(
  baseUrl: string,
  lang: Lang,
  location: string[],
  sp: { [key: string]: string | string[] | undefined }
): string  => {
  const locationPath = location.length > 0 ? location.join("/") : ""

  const canonicalParams = new URLSearchParams()
  if (sp.listing_type) canonicalParams.set("listing_type", String(sp.listing_type))
  if (sp.type) canonicalParams.set("type", String(sp.type))
  if (sp.sort_by && sp.sort_by !== "created_at_desc") canonicalParams.set("sort_by", String(sp.sort_by))
  if (sp.page && Number(sp.page) > 1) canonicalParams.set("page", String(sp.page))

  const qs = canonicalParams.toString()
  return `${baseUrl}/${lang}${locationPath ? `/${locationPath}` : ""}${qs ? `?${qs}` : ""}`
}