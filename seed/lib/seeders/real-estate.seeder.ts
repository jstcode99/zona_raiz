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

  // Insertar Real Estates
  logger.info(`Insertando ${realEstates.length} inmobiliarias...`);
  const realEstateInserts = realEstates.map((re) => ({
    // id se autogenera con gen_random_uuid() en la BD
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
    .insert(realEstateInserts);

  if (reError) {
    logger.error("Error insertando inmobiliarias:", reError.message);
    throw reError;
  }

  logger.success(`✓ ${realEstates.length} inmobiliarias insertadas`);

  // Crear relaciones agente-perfil
  // Para cada inmobiliaria: 1 coordinador + agentes
  const agents: SeedAgent[] = [];

  realEstates.forEach((re, index) => {
    // Encontrar el coordinator para esta inmobiliaria
    const coordinator = coordinatorProfiles.find(
      (p) => p.id === coordinatorProfiles[index * 3]?.id,
    );

    if (coordinator) {
      agents.push({
        profileId: coordinator.id,
        realEstateId: re.id,
        role: "coordinator",
      });
    }

    // Agregar agentes (3 por inmobiliaria)
    for (let i = 0; i < 3; i++) {
      const agentIndex = index * 3 + i;
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
    // id se autogenera con gen_random_uuid() en la BD
    real_estate_id: agent.realEstateId,
    profile_id: agent.profileId,
    role: agent.role,
  }));

  const { error: raError } = await supabase
    .from("real_estate_agents")
    .insert(agentInserts);

  if (raError) {
    logger.error("Error insertando agentes:", raError.message);
    throw raError;
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
