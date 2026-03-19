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

export interface LandingAgent {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface LandingData {
  listings: ListingEntity[];
  cities: LandingCity[];
  stats: LandingStats;
  agents?: LandingAgent[];
}
