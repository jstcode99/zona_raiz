// ==========================================
// Favorites SQL Generator
// ==========================================

import type { SeedFavorite } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar favoritos.
 */
export function generateFavoritesSQL(favorites: SeedFavorite[]): string {
  if (favorites.length === 0) {
    return "-- No hay favoritos para insertar\n";
  }

  const header = `-- Insertando ${favorites.length} favoritos...\n`;
  const sql = buildMultipleInserts("favorites", favorites);

  return header + sql + "\n";
}