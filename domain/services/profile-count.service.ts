import { ProfilePort } from "@/domain/ports/profile.port";
import { unstable_cache } from "next/cache";

export interface ProfileCountFilters {
  real_estate_id?: string;
  start_date?: string;
  end_date?: string;
}

export class ProfileCountService {
  constructor(private profilePort: ProfilePort) {}

  private buildCacheKey(filters?: ProfileCountFilters): string {
    if (!filters) return "all";
    
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}:${v}`);
    
    return parts.length > 0 ? parts.join(":") : "all";
  }

  async count(filters?: ProfileCountFilters): Promise<number> {
    return this.profilePort.count(filters);
  }

  getCachedCount(filters?: ProfileCountFilters) {
    const cacheKey = `profile-count:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.profilePort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["profiles", "profile-count"],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string, filters?: Omit<ProfileCountFilters, 'start_date' | 'end_date'>) {
    const cacheKey = `profile-count:date-range:${startDate}:${endDate}:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.profilePort.count({ ...filters, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["profiles", "profile-count"],
      }
    )();
  }
}
