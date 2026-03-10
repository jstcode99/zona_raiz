import { ListingEntity } from "@/domain/entities/listing.entity"
import { ListingPort } from "@/domain/ports/listing.port"
import { unstable_cache } from "next/cache"

export interface ListingSearchFilters {
  q?: string
  listing_type?: string
  type?: string
  country?: string
  state?: string
  city?: string
  neighborhood?: string
  street?: string
  min_price?: number
  max_price?: number
  min_bedrooms?: number
  min_bathrooms?: number
  amenities?: string[]
  sort_by?: string
  page?: number
  limit?: number
  status: string
}

export interface ListingSearchResult {
  listings: ListingEntity[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class ListingSearchService {
  constructor(private listingPort: ListingPort) {}

  private buildCacheKey(filters: ListingSearchFilters): string {
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}:${v.join(",")}`
        return `${k}:${v}`
      })
    return parts.length > 0 ? parts.join(":") : "default"
  }

  async search(filters: ListingSearchFilters): Promise<ListingSearchResult> {
    const page = filters.page || 1
    const limit = filters.limit || 12
    
    const allListings = await this.listingPort.all(filters)
    const total = allListings.length
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedListings = allListings.slice(startIndex, endIndex)

    return {
      listings: paginatedListings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  getCachedSearch(filters: ListingSearchFilters) {
    const cacheKey = `listing-search:${this.buildCacheKey(filters)}`
    
    return unstable_cache(
      async () => this.search(filters),
      [cacheKey],
      {
        revalidate: 60,
        tags: ["listings", "listing-search"],
      }
    )()
  }

  async searchWithCount(filters: ListingSearchFilters): Promise<{ listings: ListingEntity[]; total: number }> {
    const page = filters.page || 1
    const limit = filters.limit || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    const allListings = await this.listingPort.all(filters)
    const total = allListings.length
    
    const paginatedListings = allListings.slice(from, to + 1)

    return {
      listings: paginatedListings,
      total,
    }
  }
}
