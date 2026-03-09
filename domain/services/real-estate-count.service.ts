import { RealEstatePort } from "@/domain/ports/real-estate.port";
import { unstable_cache } from "next/cache";

export interface RealEstateCountFilters {
  start_date?: string;
  end_date?: string;
}

export class RealEstateCountService {
  constructor(private realEstatePort: RealEstatePort) {}

  private buildCacheKey(filters?: RealEstateCountFilters): string {
    if (!filters) return "all";
    
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}:${v}`);
    
    return parts.length > 0 ? parts.join(":") : "all";
  }

  async count(filters?: RealEstateCountFilters): Promise<number> {
    return this.realEstatePort.count(filters);
  }

  getCachedCount(filters?: RealEstateCountFilters) {
    const cacheKey = `real-estate-count:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.realEstatePort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["real-estates", "real-estate-count"],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string, filters?: Omit<RealEstateCountFilters, 'start_date' | 'end_date'>) {
    const cacheKey = `real-estate-count:date-range:${startDate}:${endDate}:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.realEstatePort.count({ ...filters, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["real-estates", "real-estate-count"],
      }
    )();
  }
}
