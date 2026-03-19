import { ListingEntity } from "../entities/listing.entity";

export interface CityWithCount {
  name: string;
  slug: string;
  count: number;
  image?: string;
}

export interface PlatformStats {
  totalListings: number;
  totalAgents: number;
  totalCities: number;
}

export interface ListingPort {
  all(filter?: any): Promise<ListingEntity[]>;
  create(data: Partial<ListingEntity>): Promise<ListingEntity>;
  update(id: string, data: Partial<ListingEntity>): Promise<ListingEntity>;
  findById(id: string): Promise<ListingEntity | null>;
  findByIds(ids: string[]): Promise<ListingEntity[]>;
  findActive(): Promise<ListingEntity[]>;
  delete(id: string): Promise<void>;
  count(filters?: any): Promise<number>;
  countWithViews(filters?: any): Promise<number>;
  findFeatured(limit?: number, realEstateId?: string): Promise<ListingEntity[]>;
  findBySlug(slug: string): Promise<ListingEntity | null>;
  countByStatusAndMonth(
    year: number,
    filters?: any,
  ): Promise<Record<string, Record<string, number>>>;
  findSimplePublished(limit?: number): Promise<ListingEntity[]>;
  findCitiesWithListings(): Promise<CityWithCount[]>;
  getStats(): Promise<PlatformStats>;
}
