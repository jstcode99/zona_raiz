import { FavoritePort } from "../ports/favorite.port";
import { FavoriteEntity } from "../entities/favorite.entity";

export type CreateFavoriteInput = Omit<FavoriteEntity, "id" | "created_at">;

export class FavoriteService {
  constructor(private readonly repo: FavoritePort) {}

  all(filters?: any) {
    return this.repo.all(filters);
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  findByProfileId(profileId: string) {
    return this.repo.findByProfileId(profileId);
  }

  findByListingId(listingId: string) {
    return this.repo.findByListingId(listingId);
  }

  exists(profileId: string, listingId: string) {
    return this.repo.exists(profileId, listingId);
  }

  create(data: CreateFavoriteInput) {
    return this.repo.create(data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  deleteByProfileAndListing(profileId: string, listingId: string) {
    return this.repo.deleteByProfileAndListing(profileId, listingId);
  }

  async toggle(profileId: string, listingId: string): Promise<boolean> {
    const isFav = await this.exists(profileId, listingId);
    if (isFav) {
      await this.deleteByProfileAndListing(profileId, listingId);
      return false;
    } else {
      await this.create({ profile_id: profileId, listing_id: listingId });
      return true;
    }
  }

  count(filters?: any) {
    return this.repo.count(filters);
  }
}
