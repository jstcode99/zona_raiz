// ==========================================
// Real Estates SQL Generator
// ==========================================

import type { SeedRealEstate } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar inmobiliarias.
 */
export function generateRealEstatesSQL(data: SeedRealEstate[]): string {
  if (data.length === 0) {
    return "-- No hay inmobiliarias para insertar\n";
  }

  const header = `-- Insertando ${data.length} inmobiliarias...\n`;
  const sql = buildMultipleInserts("real_estates", data);

  return header + sql + "\n";
}