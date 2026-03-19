import { ListingEntity } from "@/domain/entities/listing.entity";

export interface LandingCity {
  name: string;
  slug: string;
  count: number;
  image?: string;
}

export interface LandingStats {
  totalListings: number;
  totalAgents: number;
  totalCities: number;
}

export interface LandingData {
  listings: ListingEntity[];
  cities: LandingCity[];
  stats: LandingStats;
}
