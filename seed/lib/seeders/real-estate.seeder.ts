// ==========================================
// Real Estate Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedRealEstate, SeedProfile, SeedAgent } from "../../types";
import { SeedLogger } from "../logger";

export interface RealEstateSeedResult {
  realEstates: SeedRealEstate[];
  profiles: SeedProfile[];
  agents: SeedAgent[];
}

export async function seedRealEstates(
  supabase: SupabaseClient,
  data: {
    realEstates: SeedRealEstate[];
    coordinatorProfiles: SeedProfile[];
    agentProfiles: SeedProfile[];
  },
  truncate: boolean,
): Promise<RealEstateSeedResult> {
  const logger = SeedLogger;
  const { realEstates, coordinatorProfiles, agentProfiles } = data;

  logger.subSection("Seed Real Estates");

  // Truncar tablas relacionadas si se solicita
  if (truncate) {
    logger.info("Truncando tablas relacionadas...");

    // Primero eliminar en orden inverso de dependencias
    await supabase
      .from("favorites")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("inquiries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("property_images")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("listings")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("properties")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("real_estate_agents")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("real_estates")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    logger.success("Tablas truncadas correctamente");
  }

  // Insertar Real Estates SIN ID - la BD lo genera con gen_random_uuid()
  // Pero necesitamos mantener los IDs pre-generados para las propiedades
  logger.info(`Insertando ${realEstates.length} inmobiliarias...`);
  
  const insertedRealEstates: SeedRealEstate[] = [];
  
  for (const re of realEstates) {
    const { data: inserted, error } = await supabase
      .from("real_estates")
      .insert({
        name: re.name,
        description: re.description,
        whatsapp: re.whatsapp,
        street: re.street,
        city: re.city,
        state: re.state,
        postal_code: re.postalCode,
        country: re.country,
        logo_url: re.logoUrl || null,
      })
      .select()
      .single();

    if (error) {
      logger.error("Error insertando inmobiliarias:", error.message);
      throw error;
    }

    if (inserted) {
      insertedRealEstates.push({
        ...re,
        id: inserted.id, // Usar el ID generado por la BD
      });
    }
  }

  logger.success(`✓ ${insertedRealEstates.length} inmobiliarias insertadas`);

  // Crear relaciones agente-perfil
  // Para cada inmobiliaria: 1 coordinador + agentes
  const agents: SeedAgent[] = [];

  insertedRealEstates.forEach((re, index) => {
    // El coordinador para esta inmobiliaria está en el índice correspondiente
    const coordinator = coordinatorProfiles[index];

    if (coordinator) {
      agents.push({
        profileId: coordinator.id,
        realEstateId: re.id,
        role: "coordinator",
      });
    }

    // Agregar agentes (3 por inmobiliaria)
    const agentsPerRealEstate = 3;
    for (let i = 0; i < agentsPerRealEstate; i++) {
      const agentIndex = index * agentsPerRealEstate + i;
      const agentProfile = agentProfiles[agentIndex];

      if (agentProfile && agentProfile.id !== coordinator?.id) {
        agents.push({
          profileId: agentProfile.id,
          realEstateId: re.id,
          role: "agent",
        });
      }
    }
  });

  // Insertar agentes en real_estate_agents SIN ID - la BD lo genera
  logger.info(`Insertando ${agents.length} relaciones agente-inmobiliaria...`);

  const insertedAgents: SeedAgent[] = [];
  
  for (const agent of agents) {
    const { data: inserted, error } = await supabase
      .from("real_estate_agents")
      .insert({
        profile_id: agent.profileId,
        real_estate_id: agent.realEstateId,
        role: agent.role,
      })
      .select()
      .single();

    if (error) {
      logger.error("Error insertando agente:", error.message);
      throw error;
    }

    if (inserted) {
      insertedAgents.push({
        ...agent,
        id: inserted.id, // Capturar el ID generado por la BD
      });
    }
  }

  logger.success(
    `✓ ${insertedAgents.length} relaciones agente-inmobiliaria insertadas`,
  );

  return {
    realEstates: insertedRealEstates,
    profiles: [...coordinatorProfiles, ...agentProfiles],
    agents: insertedAgents,
  };
}
