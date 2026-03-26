// ==========================================
// Property Images Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedPropertyImage } from "../../types";
import { generateFakeUUID } from "./uuid";

/**
 * Genera imágenes fake para propiedades.
 * @param count - Cantidad de imágenes a generar (aproximada)
 * @param properties - Propiedades existentes (solo necesita id y title)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateFakePropertyImages(
  count: number,
  properties: any[],
): SeedPropertyImage[] {
  if (properties.length === 0) return [];

  const images: SeedPropertyImage[] = [];

  properties.forEach((property, propIndex) => {
    const imageCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < imageCount; i++) {
      images.push({
        id: generateFakeUUID(),
        property_id: property.id,
        public_url: faker.image.url({ width: 1200, height: 800 }),
        filename: `image-${propIndex}-${i}.jpg`,
        file_size: faker.number.int({ min: 100000, max: 500000 }),
        mime_type: "image/jpeg",
        width: 1200,
        height: 800,
        display_order: i,
        is_primary: i === 0,
        alt_text: `Imagen ${i + 1} de ${property.title}`,
      });
    }
  });

  return images;
}