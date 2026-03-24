// ==========================================
// Listing Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedListing, SeedProperty, SeedAgent } from "../../types";
import { SeedLogger } from "../logger";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";

/**
 * Inserta listings (listados) en la base de datos.
 * Cada listing se inserta individualmente para obtener su ID generado por la BD.
 */
export async function seedListings(
  supabase: SupabaseClient,
  listings: SeedListing[],
  properties: SeedProperty[],
  agents: SeedAgent[],
  truncate: boolean,
): Promise<SeedListing[]> {
  const logger = SeedLogger;

  logger.subSection("Seed Listings");

  if (truncate) {
    logger.info("Truncando listings...");
    await supabase
      .from("listings")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
  }

  // Crear mapa de property -> real_estate_id
  const propertyToRealEstate = new Map<string, string>();
  properties.forEach((p) => {
    propertyToRealEstate.set(p.id, p.realEstateId);
  });

  // Crear mapa de real_estate_id -> agent_id (el ID de real_estate_agents)
  const agentIdsByRealEstate = new Map<string, string>();
  agents.forEach((agent) => {
    if (agent.id && agent.realEstateId) {
      if (!agentIdsByRealEstate.has(agent.realEstateId)) {
        agentIdsByRealEstate.set(agent.realEstateId, agent.id);
      }
    }
  });

  logger.info(`Insertando ${listings.length} listados...`);

  const insertedListings: SeedListing[] = [];

  for (const listing of listings) {
    // Asignar el agente de la misma inmobiliaria
    const realEstateId = propertyToRealEstate.get(listing.propertyId);
    const agentId = realEstateId
      ? agentIdsByRealEstate.get(realEstateId) || null
      : null;

    if (!agentId) {
      throw new Error(
        `No hay agente disponible para la inmobiliaria ${realEstateId}. No se puede crear el listing.`,
      );
    }

    const { data: inserted, error } = await supabase
      .from("listings")
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      logger.error("Error insertando listing:", error.message);
      throw error;
    }

    if (inserted) {
      insertedListings.push({
        ...listing,
        id: inserted.id, // Usar el ID generado por la BD
        agentId: inserted.agent_id, // Actualizar con el agent_id usado
      });
    }
  }

  logger.success(`✓ ${insertedListings.length} listados insertados`);

  return insertedListings;
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
    active: listings.filter((l) => l.status === ListingStatus.ACTIVE).length,
    draft: listings.filter((l) => l.status === ListingStatus.DRAFT).length,
    featured: listings.filter((l) => l.featured).length,
    sale: listings.filter((l) => l.listingType === ListingType.SALE).length,
    rent: listings.filter((l) => l.listingType === ListingType.RENT).length,
  };
}
