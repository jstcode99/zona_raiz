// ==========================================
// Favorite Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedFavorite, SeedListing, SeedProfile } from "../../types";
import { SeedLogger } from "../logger";

/**
 * Genera favoritos aleatorios entre clientes y listados activos.
 */
export function generateFavorites(
  clientProfiles: SeedProfile[],
  activeListings: SeedListing[],
  count: number
): SeedFavorite[] {
  const favorites: SeedFavorite[] = [];
  const usedKeys = new Set<string>();

  const activeListingIds = activeListings.map((l) => l.id);

  while (favorites.length < count && favorites.length < clientProfiles.length * activeListingIds.length) {
    const randomClient = clientProfiles[Math.floor(Math.random() * clientProfiles.length)];
    const randomListing = activeListings[Math.floor(Math.random() * activeListings.length)];
    const key = `${randomClient.id}-${randomListing.id}`;

    if (!usedKeys.has(key)) {
      usedKeys.add(key);
      favorites.push({
        id: `fv-${String(favorites.length + 1).padStart(4, "0")}`,
        profileId: randomClient.id,
        listingId: randomListing.id,
      });
    }
  }

  return favorites;
}

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
    id: fav.id,
    profile_id: fav.profileId,
    listing_id: fav.listingId,
  }));

  const { error } = await supabase
    .from("favorites")
    .upsert(favoriteInserts, { onConflict: "id" });

  if (error) {
    logger.error("Error insertando favoritos:", error.message);
    throw error;
  }

  logger.success(`✓ ${favorites.length} favoritos insertados`);
}
