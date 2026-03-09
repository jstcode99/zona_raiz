import { ListingPort } from "@/domain/ports/listing.port";
import { unstable_cache } from "next/cache";

export interface ListingCountFilters {
  real_estate_id?: string;
  property_id?: string;
  type?: string;
  listing_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export class ListingCountService {
  constructor(private listingPort: ListingPort) {}

  private buildCacheKey(filters?: ListingCountFilters): string {
    if (!filters) return "all";
    
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}:${v}`);
    
    return parts.length > 0 ? parts.join(":") : "all";
  }

  async count(filters?: ListingCountFilters): Promise<number> {
    return this.listingPort.count(filters);
  }

  getCachedCount(filters?: ListingCountFilters) {
    const cacheKey = `listing-count:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.listingPort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-count", ...(filters?.real_estate_id ? [`real-estate:${filters.real_estate_id}`] : [])],
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
}
