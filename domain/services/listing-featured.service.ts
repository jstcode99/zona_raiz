import { ListingPort } from "@/domain/ports/listing.port";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { unstable_cache } from "next/cache";

export class ListingFeaturedService {
  constructor(private listingPort: ListingPort) {}

  async getFeatured(limit: number = 10, realEstateId?: string): Promise<ListingEntity[]> {
    return this.listingPort.findFeatured(limit, realEstateId);
  }

  getCachedFeatured(limit: number = 10, realEstateId?: string) {
    const cacheKey = `listing-featured:${limit}:${realEstateId || "all"}`;
    
    return unstable_cache(
      async () => this.listingPort.findFeatured(limit, realEstateId),
      [cacheKey],
      {
        revalidate: 300,
        tags: ["listings", "listing-featured", ...(realEstateId ? [`real-estate:${realEstateId}`] : [])],
      }
    )();
  }
}
