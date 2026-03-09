import { ListingPort } from "@/domain/ports/listing.port";
import { unstable_cache } from "next/cache";

export interface ListingViewsCountFilters {
  real_estate_id?: string;
  property_id?: string;
  type?: string;
  listing_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export class ListingViewsCountService {
  constructor(private listingPort: ListingPort) {}

  private buildCacheKey(filters?: ListingViewsCountFilters): string {
    if (!filters) return "all";
    
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}:${v}`);
    
    return parts.length > 0 ? parts.join(":") : "all";
  }

  async count(filters?: ListingViewsCountFilters): Promise<number> {
    return this.listingPort.countWithViews(filters);
  }

  getCachedCount(filters?: ListingViewsCountFilters) {
    const cacheKey = `listing-views-count:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.listingPort.countWithViews(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-views-count", ...(filters?.real_estate_id ? [`real-estate:${filters.real_estate_id}`] : [])],
      }
    )();
  }

  async getCountByRealEstate(realEstateId: string): Promise<number> {
    return this.listingPort.countWithViews({ real_estate_id: realEstateId });
  }

  getCachedCountByRealEstate(realEstateId: string) {
    return unstable_cache(
      async () => this.listingPort.countWithViews({ real_estate_id: realEstateId }),
      [`listing-views-count:real-estate:${realEstateId}`],
      {
        revalidate: 300,
        tags: ["listings", `real-estate:${realEstateId}`],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string, filters?: Omit<ListingViewsCountFilters, 'start_date' | 'end_date'>) {
    const cacheKey = `listing-views-count:date-range:${startDate}:${endDate}:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.listingPort.countWithViews({ ...filters, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-views-count"],
      }
    )();
  }

  getCachedCountByRealEstateWithDateRange(realEstateId: string, startDate: string, endDate: string) {
    const cacheKey = `listing-views-count:real-estate:${realEstateId}:date-range:${startDate}:${endDate}`;
    
    return unstable_cache(
      async () => this.listingPort.countWithViews({ real_estate_id: realEstateId, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", `real-estate:${realEstateId}`],
      }
    )();
  }
}
