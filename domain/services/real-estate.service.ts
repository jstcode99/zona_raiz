import { RealEstatePort } from "@/domain/ports/real-estate.port";
import { RealEstateFilters } from "@/domain/entities/real-estate.entity";
import { unstable_cache } from "next/cache";

export class RealEstateService {
  constructor(private realEstatePort: RealEstatePort) {}

  all(filters?: RealEstateFilters) {
    return this.realEstatePort.all(filters);
  }

  getCachedAll(filters?: RealEstateFilters) {
    const cacheKey = filters ? `real-estate:all:${JSON.stringify(filters)}` : "real-estate:all";
    
    return unstable_cache(
      async () => this.realEstatePort.all(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["real-estates", "real-estate:all"],
      }
    )();
  }

  getById(id: string) {
    return this.realEstatePort.getById(id);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.realEstatePort.getById(id),
      [`real-estate:${id}`],
      {
        revalidate: 300,
        tags: ["real-estates", `real-estate:${id}`],
      }
    )();
  }

  create(data: Parameters<RealEstatePort["create"]>[0]) {
    return this.realEstatePort.create(data);
  }

  update(id: string, data: Parameters<RealEstatePort["update"]>[1]) {
    return this.realEstatePort.update(id, data);
  }

  delete(id: string) {
    return this.realEstatePort.delete(id);
  }

  uploadLogo(id: string, file: File) {
    return this.realEstatePort.uploadLogo(id, file);
  }

  updatePathLogo(id: string, logoUrl: string) {
    return this.realEstatePort.updatePathLogo(id, logoUrl);
  }

  count(filters?: { start_date?: string; end_date?: string }) {
    return this.realEstatePort.count(filters);
  }

  getCachedCount(filters?: { start_date?: string; end_date?: string }) {
    const cacheKey = filters ? `real-estate:count:${JSON.stringify(filters)}` : "real-estate:count";
    
    return unstable_cache(
      async () => this.realEstatePort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["real-estates", "real-estate-count"],
      }
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string) {
    const cacheKey = `real-estate:count:date-range:${startDate}:${endDate}`;
    
    return unstable_cache(
      async () => this.realEstatePort.count({ start_date: startDate, end_date: endDate }),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["real-estates", "real-estate-count"],
      }
    )();
  }
}
