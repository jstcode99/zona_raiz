// ==========================================
// Property Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedProperty, SeedPropertyImage, SeedAgent } from "../../types";
import { SeedLogger } from "../logger";

export interface PropertySeedResult {
  properties: SeedProperty[];
  propertyImages: SeedPropertyImage[];
}

/**
 * Inserta propiedades en la base de datos.
 */
export async function seedProperties(
  supabase: SupabaseClient,
  properties: SeedProperty[],
  agents: SeedAgent[],
  truncate: boolean
): Promise<PropertySeedResult> {
  const logger = SeedLogger;

  logger.subSection("Seed Properties");

  if (truncate) {
    logger.info("Truncando propiedades e imágenes...");
    await supabase.from("property_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("properties").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  logger.info(`Insertando ${properties.length} propiedades...`);

  // Crear un mapa de real_estate_id a agentes disponibles
  const agentsByRealEstate = new Map<string, string[]>();
  agents.forEach((agent) => {
    const existing = agentsByRealEstate.get(agent.realEstateId) || [];
    existing.push(agent.profileId);
    agentsByRealEstate.set(agent.realEstateId, existing);
  });

  const propertyInserts = properties.map((property) => {
    // Asignar un agente de la misma inmobiliaria
    const availableAgents = agentsByRealEstate.get(property.realEstateId) || [];
    const createdBy = availableAgents[0] || null;

    return {
      id: property.id, // ID pre-generado por Faker para mantener consistencia
      real_estate_id: property.realEstateId,
      title: property.title,
      slug: property.slug,
      description: property.description,
      property_type: property.propertyType,
      street: property.street || null,
      city: property.city,
      state: property.state,
      postal_code: property.postalCode || null,
      country: property.country,
      neighborhood: property.neighborhood || null,
      latitude: property.latitude || null,
      longitude: property.longitude || null,
      bedrooms: property.bedrooms || null,
      bathrooms: property.bathrooms || null,
      total_area: property.totalArea || null,
      built_area: property.builtArea || null,
      lot_area: property.lotArea || null,
      floors: property.floors || null,
      year_built: property.yearBuilt || null,
      parking_spots: property.parkingSpots || null,
      amenities: property.amenities || [],
      created_by: createdBy,
    };
  });

  const { error: propError } = await supabase
    .from("properties")
    .upsert(propertyInserts, { onConflict: "id" });

  if (propError) {
    logger.error("Error insertando propiedades:", propError.message);
    throw propError;
  }

  logger.success(`✓ ${properties.length} propiedades insertadas`);

  return { properties, propertyImages: [] };
}

/**
 * Inserta imágenes de propiedades en la base de datos.
 */
export async function seedPropertyImages(
  supabase: SupabaseClient,
  images: SeedPropertyImage[],
  truncate: boolean
): Promise<void> {
  const logger = SeedLogger;

  logger.subSection("Seed Property Images");

  if (truncate) {
    logger.info("Truncando imágenes...");
    await supabase.from("property_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  logger.info(`Insertando ${images.length} imágenes...`);

  const imageInserts = images.map((image) => ({
    id: image.id, // ID pre-generado por Faker para mantener consistencia
    property_id: image.propertyId,
    public_url: image.publicUrl,
    filename: image.filename,
    file_size: image.fileSize || null,
    mime_type: image.mimeType || null,
    width: image.width || null,
    height: image.height || null,
    display_order: image.displayOrder,
    is_primary: image.isPrimary,
    alt_text: image.altText || null,
    caption: image.caption || null,
  }));

  const { error } = await supabase
    .from("property_images")
    .upsert(imageInserts, { onConflict: "id" });

  if (error) {
    logger.error("Error insertando imágenes:", error.message);
    throw error;
  }

  logger.success(`✓ ${images.length} imágenes insertadas`);
}
