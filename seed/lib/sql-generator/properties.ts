// ==========================================
// Properties SQL Generator
// ==========================================

import type { SeedProperty } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar propiedades.
 */
export function generatePropertiesSQL(properties: SeedProperty[]): string {
  if (properties.length === 0) {
    return "-- No hay propiedades para insertar\n";
  }

  const header = `-- Insertando ${properties.length} propiedades...\n`;
  const sql = buildMultipleInserts("properties", properties);

  return header + sql + "\n";
}