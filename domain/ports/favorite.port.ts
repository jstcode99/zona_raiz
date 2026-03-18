import { FavoriteEntity } from "../entities/favorite.entity";

export interface FavoritePort {
  all(filters?: any): Promise<FavoriteEntity[]>;
  findById(id: string): Promise<FavoriteEntity | null>;
  findByProfileId(profileId: string): Promise<FavoriteEntity[]>;
  findByListingId(listingId: string): Promise<FavoriteEntity[]>;
  exists(profileId: string, listingId: string): Promise<boolean>;
  create(data: Partial<FavoriteEntity>): Promise<FavoriteEntity>;
  delete(id: string): Promise<void>;
  deleteByProfileAndListing(
    profileId: string,
    listingId: string,
  ): Promise<void>;
  count(filters?: any): Promise<number>;
}
