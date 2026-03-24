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

  // Truncar tablas relacionadas si se solicita`
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

  // Insertar Real Estates con IDs pre-generados
  logger.info(`Insertando ${realEstates.length} inmobiliarias...`);
  const realEstateInserts = realEstates.map((re) => ({
    id: re.id, // ID pre-generado por Faker para mantener consistencia
    name: re.name,
    description: re.description,
    whatsapp: re.whatsapp,
    street: re.street,
    city: re.city,
    state: re.state,
    postal_code: re.postalCode,
    country: re.country,
    logo_url: re.logoUrl || null,
  }));

  const { error: reError } = await supabase
    .from("real_estates")
    .upsert(realEstateInserts, { onConflict: "id" });

  if (reError) {
    console.log(reError.message, "message.............");
    logger.error("Error insertando inmobiliarias:", reError.message);
    throw reError;
  }

  logger.success(`✓ ${realEstates.length} inmobiliarias insertadas`);

  // Crear relaciones agente-perfil
  // Para cada inmobiliaria: 1 coordinador + agentes
  const agents: SeedAgent[] = [];

  realEstates.forEach((re, index) => {
    // El coordinador para esta inmobiliaria está en el índice corresponding
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

  // Insertar agentes en real_estate_agents
  logger.info(`Insertando ${agents.length} relaciones agente-inmobiliaria...`);

  const agentInserts = agents.map((agent) => ({
    profile_id: agent.profileId,
    real_estate_id: agent.realEstateId,
    role: agent.role,
  }));

  const { error: raError, data: agentsData } = await supabase
    .from("real_estate_agents")
    .insert(agentInserts)
    .select();

  if (raError) {
    logger.error("Error insertando agentes:", raError.message);
    throw raError;
  }

  // Mapear los IDs generados por la BD a los agentes
  if (agentsData) {
    agentsData.forEach((insertedAgent, index) => {
      if (agents[index]) {
        agents[index].id = insertedAgent.id;
      }
    });
  }

  logger.success(
    `✓ ${agents.length} relaciones agente-inmobiliaria insertadas`,
  );

  return {
    realEstates,
    profiles: [...coordinatorProfiles, ...agentProfiles],
    agents,
  };
}
