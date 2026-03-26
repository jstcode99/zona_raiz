// ==========================================
// Favorites Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedFavorite } from "../../types";
import { generateFakeUUID } from "./uuid";

/**
 * Genera favoritos fake.
 */
export function generateFakeFavorites(
  count: number,
  clients: { id: string }[],
  listings: { id: string; status: string }[],
): SeedFavorite[] {
  const favorites: SeedFavorite[] = [];
  const usedPairs = new Set<string>();

  const activeListings = listings.filter((l) => l.status === "active");

  while (
    favorites.length < count &&
    favorites.length < clients.length * activeListings.length
  ) {
    const client = faker.helpers.arrayElement(clients);
    const listing = faker.helpers.arrayElement(activeListings);
    const pairKey = `${client.id}-${listing.id}`;

    if (!usedPairs.has(pairKey)) {
      usedPairs.add(pairKey);
      favorites.push({
        id: generateFakeUUID(),
        profile_id: client.id,
        listing_id: listing.id,
      });
    }
  }

  return favorites;
}