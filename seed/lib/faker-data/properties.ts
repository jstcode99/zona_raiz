// ==========================================
// Properties Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedProperty } from "../../types";
import { PropertyType } from "@/domain/entities/property.enums";
import { amenitiesOptions } from "@/domain/entities/property.entity";
import { generateFakeUUID } from "./uuid";

/**
 * Simple slugify function to generate URL-safe slugs
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Genera propiedades fake.
 */
export function generateFakeProperties(
  count: number,
  realEstateIds: string[],
): SeedProperty[] {
  if (realEstateIds.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const realEstateId = realEstateIds[i % realEstateIds.length];
    const location = faker.location;

    const propertyTypes = Object.values(PropertyType);
    const propertyType = faker.helpers.arrayElement(propertyTypes);

    const bedrooms =
      propertyType === PropertyType.Land || propertyType === PropertyType.Commercial
        ? 0
        : faker.number.int({ min: 1, max: 5 });

    const bathrooms =
      propertyType === PropertyType.Land || propertyType === PropertyType.Commercial
        ? 0
        : faker.number.int({ min: 1, max: 5 });

    const totalArea = faker.number.int({ min: 50, max: 1000 });
    const builtArea = faker.number.int({ min: 40, max: 800 });
    const lotArea =
      propertyType === PropertyType.House || propertyType === PropertyType.Land
        ? faker.number.int({ min: 200, max: 2000 })
        : 0;
    const floors =
      propertyType === PropertyType.House
        ? faker.number.int({ min: 1, max: 3 })
        : propertyType === PropertyType.Apartment
          ? 1
          : 0;
    const yearBuilt = faker.number.int({ min: 1970, max: 2024 });
    const parkingSpots =
      propertyType !== PropertyType.Land
        ? faker.number.int({ min: 0, max: 3 })
        : 0;
    const amenities = faker.helpers.arrayElements(amenitiesOptions, {
      min: 1,
      max: 5,
    });
    const title = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} ${faker.number.int({ min: 1, max: 5 })} ambientes en ${faker.location.city()}`;

    return {
      id: generateFakeUUID(),
      real_estate_id: realEstateId,
      title,
      slug: slugify(title),
      description: faker.lorem.paragraph(3),
      property_type: propertyType,
      street: location.streetAddress(),
      city: location.city(),
      state: location.state(),
      country: "Colombia",
      postal_code: location.zipCode(),
      neighborhood: location.county(),
      latitude: location.latitude(),
      longitude: location.longitude(),
      bedrooms,
      bathrooms,
      total_area: totalArea,
      built_area: builtArea,
      lot_area: lotArea,
      floors: floors,
      year_built: yearBuilt,
      parking_spots: parkingSpots,
      amenities,
    };
  });
}