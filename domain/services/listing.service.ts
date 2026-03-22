import {
  ListingPort,
  ListingCountFilters,
  ListingSearchFilters,
} from "@/domain/ports/listing.port";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { ListingStatus } from "../entities/listing.enums";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export type CreateListingInput = Omit<
  ListingEntity,
  | "id"
  | "property_id"
  | "views_count"
  | "enquiries_count"
  | "whatsapp_clicks"
  | "published_at"
  | "property"
>;

export interface ListingSearchResult {
  listings: ListingEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListingService {
  constructor(
    private readonly listingPort: ListingPort,
    private lang: Lang = "es",
  ) {}

  all(filter?: ListingSearchFilters) {
    return this.listingPort.all(filter);
  }

  getCachedAll(filter?: ListingSearchFilters) {
    const cacheKey = filter
      ? `listing:all:${JSON.stringify(filter)}`
      : "listing:all";

    return unstable_cache(
      async () => this.listingPort.all(filter),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.ALL],
      },
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

  findByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return this.listingPort.findByIds(ids);
  }

  getCachedById(id: string) {
    return unstable_cache(
      async () => this.listingPort.findById(id),
      [`listing:${id}`],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.DETAIL(id)],
      },
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
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.ACTIVE],
      },
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
        tags: [
          CACHE_TAGS.LISTING.PRINCIPAL,
          CACHE_TAGS.LISTING.FEATURED,
          ...(realEstateId
            ? [CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId)]
            : []),
        ],
      },
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
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.SLUG(slug)],
      },
    )();
  }

  count(filters?: ListingCountFilters) {
    return this.listingPort.count(filters);
  }

  getCachedCount(filters?: ListingCountFilters) {
    const cacheKey = filters
      ? `listing:count:${JSON.stringify(filters)}`
      : "listing:count";

    return unstable_cache(
      async () => this.listingPort.count(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.COUNT],
      },
    )();
  }

  countWithViews(filters?: ListingCountFilters) {
    return this.listingPort.countWithViews(filters);
  }

  getCachedCountWithViews(filters?: ListingCountFilters) {
    const cacheKey = filters
      ? `listing:count:with-views:${JSON.stringify(filters)}`
      : "listing:count:with-views";

    return unstable_cache(
      async () => this.listingPort.countWithViews(filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.COUNT],
      },
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
        tags: [
          CACHE_TAGS.LISTING.PRINCIPAL,
          CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId),
        ],
      },
    )();
  }

  getCachedCountWithDateRange(
    startDate: string,
    endDate: string,
    filters?: Omit<ListingCountFilters, "start_date" | "end_date">,
  ) {
    const cacheKey = `listing-count:date-range:${startDate}:${endDate}:${this.buildCacheKey(filters as ListingSearchFilters | undefined)}`;

    return unstable_cache(
      async () =>
        this.listingPort.count({
          ...filters,
          start_date: startDate,
          end_date: endDate,
        }),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.COUNT],
      },
    )();
  }

  getCachedCountByRealEstateWithDateRange(
    realEstateId: string,
    startDate: string,
    endDate: string,
  ) {
    const cacheKey = `listing-count:real-estate:${realEstateId}:date-range:${startDate}:${endDate}`;

    return unstable_cache(
      async () =>
        this.listingPort.count({
          real_estate_id: realEstateId,
          start_date: startDate,
          end_date: endDate,
        }),
      [cacheKey],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.LISTING.PRINCIPAL,
          CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId),
        ],
      },
    )();
  }

  findSimplePublished(limit: number = 10) {
    return this.listingPort.findSimplePublished(limit);
  }

  getCachedSimplePublished(limit: number = 10) {
    const cacheKey = `listing:simple-published:${limit}`;

    return unstable_cache(
      async () => this.listingPort.findSimplePublished(limit),
      [cacheKey],
      {
        revalidate: 60,
        tags: [
          CACHE_TAGS.LISTING.PRINCIPAL,
          CACHE_TAGS.LISTING.SIMPLE_PUBLISHED,
        ],
      },
    )();
  }

  private buildCacheKey(filters?: ListingSearchFilters): string {
    const parts =
      filters &&
      Object.entries(filters)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => {
          if (Array.isArray(v)) return `${k}:${v.join(",")}`;
          return `${k}:${v}`;
        });
    return parts && parts.length > 0 ? parts.join(":") : "default";
  }

  async search(filters: ListingSearchFilters): Promise<ListingSearchResult> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;

    const allListings = await this.listingPort.all(filters);
    const total = allListings.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = allListings.slice(startIndex, endIndex);

    return {
      listings: paginatedListings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  getCachedSearch(filters: ListingSearchFilters) {
    const cacheKey = `listing-search:${this.buildCacheKey(filters)}`;

    return unstable_cache(async () => this.search(filters), [cacheKey], {
      revalidate: 60,
      tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.SEARCH],
    })();
  }

  async searchWithCount(
    filters: ListingSearchFilters,
  ): Promise<{ listings: ListingEntity[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const allListings = await this.listingPort.all({
      ...filters,
      status: ListingStatus.ACTIVE,
    });
    const total = allListings.length;

    const paginatedListings = allListings.slice(from, to + 1);

    return {
      listings: paginatedListings,
      total,
    };
  }

  getCachedSearchWithCount(filters: ListingSearchFilters) {
    const cacheKey = `listing-search:with-count:${this.buildCacheKey(filters)}`;

    return unstable_cache(
      async () => this.searchWithCount(filters),
      [cacheKey],
      {
        revalidate: 60,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.SEARCH],
      },
    )();
  }

  countByStatusAndMonth(
    year: number,
    filters?: Omit<ListingCountFilters, "start_date" | "end_date">,
  ) {
    return this.listingPort.countByStatusAndMonth(year, filters);
  }

  getCachedCountByStatusAndMonth(
    year: number,
    filters?: Omit<ListingCountFilters, "start_date" | "end_date">,
  ) {
    const cacheKey = `listing-count:status-month:${year}:${filters?.real_estate_id || "all"}`;

    return unstable_cache(
      async () => this.listingPort.countByStatusAndMonth(year, filters),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.COUNT],
      },
    )();
  }

  findCitiesWithActiveListings() {
    return this.listingPort.findCitiesWithActiveListings();
  }

  getCachedCitiesWithActiveListings() {
    return unstable_cache(
      async () => this.listingPort.findCitiesWithActiveListings(),
      [CACHE_TAGS.LISTING.CITIES],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.CITIES],
      },
    )();
  }

  getLandingStats() {
    return this.listingPort.getLandingStats();
  }

  getCachedLandingStats() {
    return unstable_cache(
      async () => this.listingPort.getLandingStats(),
      [CACHE_TAGS.LISTING.STATS],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.LISTING.PRINCIPAL, CACHE_TAGS.LISTING.STATS],
      },
    )();
  }
}
