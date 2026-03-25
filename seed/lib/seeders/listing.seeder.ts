// ==========================================
// Listing Seeder
// ==========================================
import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedListing, SeedProperty, SeedAgent } from "../../types";
import { SeedLogger } from "../logger";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity";

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

  // Mapa property_id -> real_estate_id
  const propertyToRealEstate = new Map<string, string>();
  properties.forEach((p) => {
    propertyToRealEstate.set(p.id, p.real_estate_id);
  });

  // Mapa real_estate_id -> agent_id
  // ✅ Filtra solo agentes con role "agent" (no coordinadores) para evitar
  //    que la validación de BD rechace un coordinador como agent_id en listings.
  const agentIdsByRealEstate = new Map<string, string>();
  agents
    .filter((a) => a.role === EAgentRole.Agent)
    .forEach((agent) => {
      if (agent.id && agent.real_estate_id) {
        if (!agentIdsByRealEstate.has(agent.real_estate_id)) {
          agentIdsByRealEstate.set(agent.real_estate_id, agent.id);
        }
      }
    });

  // Fallback: si no hay agentes puros, aceptar coordinadores
  if (agentIdsByRealEstate.size === 0) {
    logger.warn(
      "No se encontraron agentes con role 'agent', usando coordinadores como fallback...",
    );
    agents.forEach((agent) => {
      if (agent.id && agent.real_estate_id) {
        if (!agentIdsByRealEstate.has(agent.real_estate_id)) {
          agentIdsByRealEstate.set(agent.real_estate_id, agent.id);
        }
      }
    });
  }

  logger.info(`Insertando ${listings.length} listados...`);

  const insertedListings: SeedListing[] = [];

  for (const listing of listings) {
    const realEstateId = propertyToRealEstate.get(listing.property_id);
    const agentId = realEstateId
      ? (agentIdsByRealEstate.get(realEstateId) ?? null)
      : null;

    if (!agentId) {
      throw new Error(
        `No hay agente disponible para la inmobiliaria ${realEstateId}. ` +
          `Verifica que seedRealEstates haya corrido antes de seedListings.`,
      );
    }

    const { data: inserted, error } = await supabase
      .from("listings")
      .insert({
        ...listing,
        agent_id: agentId, // ID real de real_estate_agents
      })
      .select()
      .single();

    if (error) {
      logger.error(
        `Error insertando listing (agentId:${agentId})`,
        error.message,
      );
      throw error;
    }

    if (inserted) {
      insertedListings.push({
        ...listing,
        id: inserted.id,
        agent_id: inserted.agent_id,
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
    sale: listings.filter((l) => l.listing_type === ListingType.SALE).length,
    rent: listings.filter((l) => l.listing_type === ListingType.RENT).length,
  };
}
