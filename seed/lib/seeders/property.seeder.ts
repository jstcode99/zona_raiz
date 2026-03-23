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
 * Cada propiedad se inserta individualmente para obtener su ID generado por la BD.
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

  // Crear un mapa de real_estate_id a profile_ids (NO agent.id)
  // properties.created_by es una FK a profiles.id, no a real_estate_agents.id
  const profileIdsByRealEstate = new Map<string, string>();
  agents.forEach((agent) => {
    if (agent.profileId && agent.realEstateId) {
      // Usar el primer perfil disponible para cada real_estate
      if (!profileIdsByRealEstate.has(agent.realEstateId)) {
        profileIdsByRealEstate.set(agent.realEstateId, agent.profileId);
      }
    }
  });

  logger.info(`Insertando ${properties.length} propiedades...`);

  const insertedProperties: SeedProperty[] = [];

  for (const property of properties) {
    // Asignar el profile_id del agente de la misma inmobiliaria
    const createdBy = profileIdsByRealEstate.get(property.realEstateId) || null;

    const { data: inserted, error } = await supabase
      .from("properties")
      .insert({
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
        created_by: createdBy, // ← profile_id (FK a profiles.id)
      })
      .select()
      .single();

    if (error) {
      logger.error("Error insertando propiedad:", error.message);
      throw error;
    }

    if (inserted) {
      insertedProperties.push({
        ...property,
        id: inserted.id, // Usar el ID generado por la BD
      });
    }
  }

  logger.success(`✓ ${insertedProperties.length} propiedades insertadas`);

  return { properties: insertedProperties, propertyImages: [] };
}

/**
 * Inserta imágenes de propiedades en la base de datos.
 */
export async function seedPropertyImages(
  supabase: SupabaseClient,
  propertyImages: SeedPropertyImage[],
  truncate: boolean
): Promise<SeedPropertyImage[]> {
  const logger = SeedLogger;

  logger.subSection("Seed Property Images");

  if (truncate) {
    logger.info("Truncando imágenes...");
    await supabase.from("property_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  if (propertyImages.length === 0) {
    logger.warn("No hay imágenes para insertar");
    return [];
  }

  logger.info(`Insertando ${propertyImages.length} imágenes...`);

  const insertedImages: SeedPropertyImage[] = [];

  for (const image of propertyImages) {
    // NO incluir id - la BD lo genera con gen_random_uuid()
    const { data: inserted, error } = await supabase
      .from("property_images")
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      logger.error("Error insertando imagen:", error.message);
      throw error;
    }

    if (inserted) {
      insertedImages.push({
        ...image,
        id: inserted.id, // Usar el ID generado por la BD
      });
    }
  }

  logger.success(`✓ ${insertedImages.length} imágenes insertadas`);

  return insertedImages;
}
