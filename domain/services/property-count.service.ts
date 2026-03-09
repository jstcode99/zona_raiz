import { PropertyPort } from "@/domain/ports/property.port";
import { PropertyType } from "@/domain/entities/property.enums";
import { unstable_cache } from "next/cache";

export interface PropertyCountFilters {
  real_estate_id?: string;
  country?: string;
  state?: string;
  city?: string;
  property_type?: string;
  start_date?: string;
  end_date?: string;
}

export class PropertyCountService {
  constructor(private propertyPort: PropertyPort) {}

  private buildCacheKey(filters?: PropertyCountFilters): string {
    if (!filters) return "all";
    
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}:${v}`);
    
    return parts.length > 0 ? parts.join(":") : "all";
  }

  async count(filters?: PropertyCountFilters): Promise<number> {
    return this.propertyPort.count(filters);
  }

  getCachedCount(filters?: PropertyCountFilters) {
    const cacheKey = `property-count:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.propertyPort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property-count", ...(filters?.real_estate_id ? [`real-estate:${filters.real_estate_id}`] : [])],
      }
    )();
  }

  async getCountByRealEstate(realEstateId: string): Promise<number> {
    return this.propertyPort.count({ real_estate_id: realEstateId });
  }

  getCachedCountByRealEstate(realEstateId: string) {
    return unstable_cache(
      async () => this.propertyPort.count({ real_estate_id: realEstateId }),
      [`property-count:real-estate:${realEstateId}`],
      {
        revalidate: 300,
        tags: ["properties", `real-estate:${realEstateId}`],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string, filters?: Omit<PropertyCountFilters, 'start_date' | 'end_date'>) {
    const cacheKey = `property-count:date-range:${startDate}:${endDate}:${this.buildCacheKey(filters)}`;
    
    return unstable_cache(
      async () => this.propertyPort.count({ ...filters, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property-count"],
      }
    )();
  }

  getCachedCountByRealEstateWithDateRange(realEstateId: string, startDate: string, endDate: string) {
    const cacheKey = `property-count:real-estate:${realEstateId}:date-range:${startDate}:${endDate}`;
    
    return unstable_cache(
      async () => this.propertyPort.count({ real_estate_id: realEstateId, start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", `real-estate:${realEstateId}`],
      }
    )();
  }

  async countByTypes(realEstateId?: string): Promise<Record<PropertyType, number>> {
    return this.propertyPort.countByTypes(realEstateId);
  }

  getCachedCountByTypes(realEstateId?: string) {
    const cacheKey = realEstateId 
      ? `property-count-by-types:real-estate:${realEstateId}`
      : `property-count-by-types:all`;
    
    return unstable_cache(
      async () => this.propertyPort.countByTypes(realEstateId),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["properties", "property-count-by-types", ...(realEstateId ? [`real-estate:${realEstateId}`] : [])],
      }
    )();
  }
}
