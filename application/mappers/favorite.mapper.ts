import { FavoriteEntity } from "@/domain/entities/favorite.entity";

export function mapFavoriteRowToEntity(row: any): FavoriteEntity {
  return {
    id: row.id,
    profile_id: row.profile_id,
    listing_id: row.listing_id,
    created_at: row.created_at,
  };
}
