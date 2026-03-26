// ==========================================
// Real Estate Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedRealEstate } from "../../types";
import { generateFakeUUID } from "./uuid";

const REAL_ESTATE_NAMES = [
  "Inmobiliaria Costa del Plata",
  "Urban Living Argentina",
  "Sierra Propiedades",
  "Bienes Raíces del Sur",
  "Argentina Real Estate Group",
  "Costa Argentina Propiedades",
];

/**
 * Genera inmobiliarias fake.
 */
export function generateFakeRealEstates(count: number): SeedRealEstate[] {
  return Array.from({ length: count }, (_, i) => {
    const location = faker.location;

    return {
      id: generateFakeUUID(),
      name: REAL_ESTATE_NAMES[i] || `Inmobiliaria ${faker.company.name()}`,
      description: faker.lorem.paragraph(2),
      whatsapp: faker.helpers.replaceSymbols("+54911########"),
      street: faker.location.streetAddress(),
      city: location.city(),
      state: location.city(),
      postal_code: location.zipCode(),
      country: location.county(),
      logo_url: faker.image.url({ width: 200, height: 200 }),
    };
  });
}