// ==========================================
// Listing Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedListing, SeedProperty, SeedAgent } from "../../types";
import { SeedLogger } from "../logger";

/**
 * Inserta listings (listados) en la base de datos.
 */
export async function seedListings(
  supabase: SupabaseClient,
  listings: SeedListing[],
  properties: SeedProperty[],
  agents: SeedAgent[],
  truncate: boolean
): Promise<SeedListing[]> {
  const logger = SeedLogger;

  logger.subSection("Seed Listings");

  if (truncate) {
    logger.info("Truncando listings...");
    await supabase.from("listings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  // Crear mapa de real_estate_id -> IDs de real_estate_agents
  const agentIdsByRealEstate = new Map<string, string[]>();
  agents.forEach((agent) => {
    if (agent.id) {
      const existing = agentIdsByRealEstate.get(agent.realEstateId) || [];
      existing.push(agent.id);
      agentIdsByRealEstate.set(agent.realEstateId, existing);
    }
  });

  // Crear mapa de property -> real_estate_id
  const propertyToRealEstate = new Map<string, string>();
  properties.forEach((p) => {
    propertyToRealEstate.set(p.id, p.realEstateId);
  });

  logger.info(`Insertando ${listings.length} listados...`);

  const listingInserts = listings.map((listing, index) => {
    // Asignar un agente de la inmobiliaria de la propiedad
    const realEstateId = propertyToRealEstate.get(listing.propertyId);
    const availableAgentIds = realEstateId ? agentIdsByRealEstate.get(realEstateId) || [] : [];
    
    // Validar que hay agentes disponibles - NO usar string vacío
    if (availableAgentIds.length === 0) {
      throw new Error(`No hay agentes disponibles para la inmobiliaria ${realEstateId}. Asegúrate de que los agentes tengan IDs asignados.`);
    }
    
    // Usar agente pre-asignado o seleccionar uno disponible
    const agentId = listing.agentId && listing.agentId !== "" 
      ? listing.agentId 
      : availableAgentIds[index % availableAgentIds.length];

    return {
      id: listing.id, // ID pre-generado por Faker para mantener consistencia
      property_id: listing.propertyId,
      agent_id: agentId, // Referencia a real_estate_agents.id
      listing_type: listing.listingType,
      price: listing.price,
      currency: listing.currency,
      price_negotiable: listing.priceNegotiable,
      whatsapp_contact: listing.whatsappContact,
      expenses_amount: listing.expensesAmount || null,
      expenses_included: listing.expensesIncluded,
      status: listing.status,
      featured: listing.featured,
      featured_until: listing.featuredUntil || null,
      meta_title: listing.metaTitle || null,
      meta_description: listing.metaDescription || null,
      keywords: listing.keywords || null,
      virtual_tour_url: listing.virtualTourUrl || null,
      video_url: listing.videoUrl || null,
      available_from: listing.availableFrom || null,
      minimum_contract_duration: listing.minimumContractDuration || null,
      views_count: listing.viewsCount,
      enquiries_count: listing.enquiriesCount,
      whatsapp_clicks: listing.whatsappClicks,
      published_at: listing.publishedAt || null,
    };
  });

  const { error } = await supabase
    .from("listings")
    .upsert(listingInserts, { onConflict: "id" });

  if (error) {
    logger.error("Error insertando listados:", error.message);
    throw error;
  }

  logger.success(`✓ ${listings.length} listados insertados`);

  return listings;
}

/**
 * Genera estadísticas de listings.
 */
export function getListingStats(listings: SeedListing[]): {
  total: number;
  active: number;
  draft: number;
  featured: number;
  sale: number;
  rent: number;
} {
  return {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    draft: listings.filter((l) => l.status === "draft").length,
    featured: listings.filter((l) => l.featured).length,
    sale: listings.filter((l) => l.listingType === "sale").length,
    rent: listings.filter((l) => l.listingType === "rent").length,
  };
}
