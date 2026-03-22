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

  // Crear mapa de property -> agentes disponibles
  const agentsByRealEstate = new Map<string, string[]>();
  agents.forEach((agent) => {
    const existing = agentsByRealEstate.get(agent.realEstateId) || [];
    existing.push(agent.profileId);
    agentsByRealEstate.set(agent.realEstateId, existing);
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
    const availableAgents = realEstateId ? agentsByRealEstate.get(realEstateId) || [] : [];
    const agentId = listing.agentId || availableAgents[index % availableAgents.length] || "";

    // Buscar el ID del real_estate_agents para este agente
    // Necesitamos encontrar el registro que conecta agente con inmobiliaria
    const agentRecord = agents.find(
      (a) => a.profileId === availableAgents[index % availableAgents.length]
    );

    return {
      // id se autogenera con gen_random_uuid() en la BD
      property_id: listing.propertyId,
      agent_id: agentRecord ? `ra-${agentRecord.profileId.split("-").pop()}` : agentId,
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
      inquiries_count: listing.inquiriesCount,
      whatsapp_clicks: listing.whatsappClicks,
      published_at: listing.publishedAt || null,
    };
  });

  const { error } = await supabase
    .from("listings")
    .insert(listingInserts);

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
