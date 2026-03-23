import { RealEstatePort } from "@/domain/ports/real-estate.port";
import { RealEstateFilters } from "@/domain/entities/real-estate.entity";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export class RealEstateService {
  constructor(
    private realEstatePort: RealEstatePort,
    private lang: Lang = "es",
  ) {}

  all(filters?: RealEstateFilters) {
    return this.realEstatePort.all(filters);
  }

  getCachedAll(filters?: RealEstateFilters) {
    return unstable_cache(
      async () => this.realEstatePort.all(filters),
      [CACHE_TAGS.REAL_ESTATE.KEYS.ALL(filters)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.REAL_ESTATE.PRINCIPAL, CACHE_TAGS.REAL_ESTATE.ALL],
      },
    )();
  }

  getById(id: string) {
    return this.realEstatePort.getById(id);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.realEstatePort.getById(id),
      [CACHE_TAGS.REAL_ESTATE.KEYS.BY_ID(id)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.REAL_ESTATE.PRINCIPAL,
          CACHE_TAGS.REAL_ESTATE.DETAIL(id),
        ],
      },
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
    return unstable_cache(
      async () => this.realEstatePort.count(filters),
      [CACHE_TAGS.REAL_ESTATE.KEYS.COUNT(filters)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.REAL_ESTATE.PRINCIPAL, CACHE_TAGS.REAL_ESTATE.COUNT],
      },
    )();
  }

  getCachedCountWithDateRange(startDate: string, endDate: string) {
    return unstable_cache(
      async () =>
        this.realEstatePort.count({ start_date: startDate, end_date: endDate }),
      [CACHE_TAGS.REAL_ESTATE.KEYS.COUNT_DATE_RANGE(startDate, endDate)],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.REAL_ESTATE.PRINCIPAL, CACHE_TAGS.REAL_ESTATE.COUNT],
      },
    )();
  }
}
