// ==========================================
// UUID Helper for Seed
// ==========================================

import { faker } from "@faker-js/faker";

/**
 * Genera un UUID v4 válido usando Faker.
 */
export function generateFakeUUID(): string {
  return faker.string.uuid();
}

/**
 * Genera múltiples UUIDs únicos.
 */
export function generateUniqueUUIDs(count: number): string[] {
  const uuids = new Set<string>();
  while (uuids.size < count) {
    uuids.add(faker.string.uuid());
  }
  return Array.from(uuids);
}