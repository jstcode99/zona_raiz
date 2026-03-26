// ==========================================
// Listings SQL Generator
// ==========================================

import type { SeedListing } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar listados.
 */
export function generateListingsSQL(listings: SeedListing[]): string {
  if (listings.length === 0) {
    return "-- No hay listados para insertar\n";
  }

  const header = `-- Insertando ${listings.length} listados...\n`;
  const sql = buildMultipleInserts("listings", listings);

  return header + sql + "\n";
}