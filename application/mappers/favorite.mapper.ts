import { FavoriteEntity } from "@/domain/entities/favorite.entity";

export function mapFavoriteRowToEntity(row: {
  id: string;
  profile_id: string;
  listing_id: string;
  created_at: string;
}): FavoriteEntity {
  return {
    id: row.id,
    profile_id: row.profile_id,
    listing_id: row.listing_id,
    created_at: row.created_at,
  };
}
