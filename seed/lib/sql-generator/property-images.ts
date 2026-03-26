// ==========================================
// Property Images SQL Generator
// ==========================================

import type { SeedPropertyImage } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar imágenes de propiedades.
 */
export function generatePropertyImagesSQL(
  images: SeedPropertyImage[],
): string {
  if (images.length === 0) {
    return "-- No hay imágenes para insertar\n";
  }

  const header = `-- Insertando ${images.length} imágenes de propiedades...\n`;
  const sql = buildMultipleInserts("property_images", images);

  return header + sql + "\n";
}