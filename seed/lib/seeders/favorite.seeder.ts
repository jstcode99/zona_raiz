// ==========================================
// Favorite Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedFavorite } from "../../types";
import { SeedLogger } from "../logger";

// Re-export from faker-data for backwards compatibility
export { generateFakeFavorites as generateFavorites } from "../faker-data";

/**
 * Inserta favoritos en la base de datos.
 */
export async function seedFavorites(
  supabase: SupabaseClient,
  favorites: SeedFavorite[],
  truncate: boolean
): Promise<void> {
  const logger = SeedLogger;

  logger.subSection("Seed Favorites");

  if (truncate) {
    logger.info("Truncando favoritos...");
    await supabase.from("favorites").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  if (favorites.length === 0) {
    logger.warn("No hay favoritos para insertar");
    return;
  }

  logger.info(`Insertando ${favorites.length} favoritos...`);

  const favoriteInserts = favorites.map((fav) => ({
    // id se autogenera con gen_random_uuid() en la BD
    profile_id: fav.profileId,
    listing_id: fav.listingId,
  }));

  const { error } = await supabase
    .from("favorites")
    .insert(favoriteInserts);

  if (error) {
    logger.error("Error insertando favoritos:", error.message);
    throw error;
  }

  logger.success(`✓ ${favorites.length} favoritos insertados`);
}
