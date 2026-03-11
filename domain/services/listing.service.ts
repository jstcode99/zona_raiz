import { ListingPort } from "@/domain/ports/listing.port";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { unstable_cache } from "next/cache";

export type CreateListingInput = Omit<ListingEntity, "id" | "property_id" | "views_count" | "inquiries_count" | "whatsapp_clicks" | "published_at" | "property">;

export interface ListingCountFilters {
  agent_id?: string;
  real_estate_id?: string;
  property_id?: string;
  type?: string;
  listing_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

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


export class ListingService {
  constructor(private readonly listingPort: ListingPort) { }

  all(filter?: any) {
    return this.listingPort.all(filter);
  }

  getCachedAll(filter?: any) {
    const cacheKey = filter ? `listing:all:${JSON.stringify(filter)}` : "listing:all";

    return unstable_cache(
      async () => this.listingPort.all(filter),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing:all"],
      }
    )();
  }

  create(data: CreateListingInput) {
    return this.listingPort.create(data);
  }

  update(id: string, data: CreateListingInput) {
    return this.listingPort.update(id, data);
  }

  findById(id: string) {
    return this.listingPort.findById(id);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.listingPort.findById(id),
      [`listing:${id}`],
      {
        revalidate: 300,
        tags: ["listings", `listing:${id}`],
      }
    )();
  }

  findActive() {
    return this.listingPort.findActive();
  }

  getCachedActive() {
    return unstable_cache(
      async () => this.listingPort.findActive(),
      ["listing:active"],
      {
        revalidate: 300,
        tags: ["listings", "listing:active"],
      }
    )();
  }

  delete(id: string) {
    return this.listingPort.delete(id);
  }

  findFeatured(limit?: number, realEstateId?: string) {
    return this.listingPort.findFeatured(limit, realEstateId);
  }

  getCachedFeatured(limit?: number, realEstateId?: string) {
    const cacheKey = `listing:featured:${limit}:${realEstateId}`;

    return unstable_cache(
      async () => this.listingPort.findFeatured(limit, realEstateId),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing:featured", ...(realEstateId ? [`real-estate:${realEstateId}`] : [])],
      }
    )();
  }

  findBySlug(slug: string) {
    return this.listingPort.findBySlug(slug);
  }

  getCachedBySlug(slug: string) {
    return unstable_cache(
      async () => this.listingPort.findBySlug(slug),
      [`listing:slug:${slug}`],
      {
        revalidate: 300,
        tags: ["listings", `listing:slug:${slug}`],
      }
    )();
  }

  count(filters?: any) {
    return this.listingPort.count(filters);
  }

  getCachedCount(filters?: any) {
    const cacheKey = filters ? `listing:count:${JSON.stringify(filters)}` : "listing:count";

    return unstable_cache(
      async () => this.listingPort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-count"],
      }
    )();
  }

  countWithViews(filters?: any) {
    return this.listingPort.countWithViews(filters);
  }

  getCachedCountWithViews(filters?: any) {
    const cacheKey = filters ? `listing:count:with-views:${JSON.stringify(filters)}` : "listing:count:with-views";

    return unstable_cache(
      async () => this.listingPort.countWithViews(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-count"],
      }
    )();
  }

  async getCountByRealEstate(realEstateId: string): Promise<number> {
    return this.listingPort.count({ real_estate_id: realEstateId });
  }

  getCachedCountByRealEstate(realEstateId: string) {
    return unstable_cache(
      async () => this.listingPort.count({ real_estate_id: realEstateId }),
      [`listing-count:real-estate:${realEstateId}`],
      {
        revalidate: 300,
        tags: ["listings", `real-estate:${realEstateId}`],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string, filters?: Omit<ListingCountFilters, 'start_date' | 'end_date'>) {
    const cacheKey = `listing-count:date-range:${startDate}:${endDate}:${this.buildCacheKey(filters)}`;

    return unstable_cache(
      async () => this.listingPort.count({ ...filters, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-count"],
      }
    )();
  }

  getCachedCountByRealEstateWithDateRange(realEstateId: string, startDate: string, endDate: string) {
    const cacheKey = `listing-count:real-estate:${realEstateId}:date-range:${startDate}:${endDate}`;

    return unstable_cache(
      async () => this.listingPort.count({ real_estate_id: realEstateId, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", `real-estate:${realEstateId}`],
      }
    )();
  }

  private buildCacheKey(filters: ListingSearchFilters): string {
    const parts = filters && Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}:${v.join(",")}`
        return `${k}:${v}`
      })
    return parts && parts.length > 0 ? parts.join(":") : "default"
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

  getCachedSearchWithCount(filters: ListingSearchFilters) {
    const cacheKey = `listing-search:with-count:${this.buildCacheKey(filters)}`

    return unstable_cache(
      async () => this.searchWithCount(filters),
      [cacheKey],
      {
        revalidate: 60,
        tags: ["listings", "listing-search"],
      }
    )()
  }
}
