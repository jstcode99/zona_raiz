// ==========================================
// Real Estate Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedRealEstate, SeedProfile, SeedAgent } from "../../types";
import { SeedLogger } from "../logger";
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity";

export interface RealEstateSeedResult {
  realEstates: SeedRealEstate[];
  profiles: SeedProfile[];
  agents: SeedAgent[];
}

/**
 * Ejecuta SQL raw usando la función exec_sql de Supabase
 */
async function execSql(supabase: SupabaseClient, sql: string): Promise<void> {
  const { error } = await supabase.rpc("exec_sql", { sql });
  if (error) {
    console.warn("exec_sql no disponible, intentando método alternativo");
  }
}

/**
 * Espera hasta que handle_new_user haya registrado el profile en la BD.
 * Reintenta con backoff exponencial hasta maxRetries veces.
 */
async function waitForProfile(
  supabase: SupabaseClient,
  profileId: string,
  maxRetries = 8,
  baseDelayMs = 300,
): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", profileId)
      .maybeSingle();

    if (data) return true;

    const delay = baseDelayMs * Math.pow(2, attempt); // 300, 600, 1200, 2400…ms
    SeedLogger.warn(
      `Profile ${profileId} aún no existe, reintentando en ${delay}ms ` +
        `(intento ${attempt + 1}/${maxRetries})...`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return false;
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

  try {
    await execSql(
      supabase,
      "DROP TRIGGER IF EXISTS on_real_estate_created ON real_estates",
    );
    logger.info("Trigger deshabilitado para el seed");
  } catch (e) {
    logger.warn("No se pudo deshabilitar el trigger, continuando...");
  }

  if (truncate) {
    logger.info("Truncando tablas relacionadas...");
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

  // ── 1. Insertar Real Estates ──────────────────────────────────────────────
  logger.info(`Insertando ${realEstates.length} inmobiliarias...`);

  const insertedRealEstates: SeedRealEstate[] = [];

  for (const realEstate of realEstates) {
    const { data: inserted, error } = await supabase
      .from("real_estates")
      .insert(realEstate)
      .select()
      .single();

    if (error) {
      logger.error("Error insertando inmobiliarias:", error.message);
      throw error;
    }

    if (inserted) {
      insertedRealEstates.push({ ...realEstate, id: inserted.id });
    }
  }

  logger.success(`✓ ${insertedRealEstates.length} inmobiliarias insertadas`);

  // ── 2. Insertar agentes ───────────────────────────────────────────────────
  // IMPORTANTE: el array insertedAgents se construye siempre DESPUÉS del
  // insert para garantizar que agent.id sea el ID real de real_estate_agents
  // y no el profile_id. El listing seeder depende de este id para la FK.
  logger.info("Insertando relaciones agente-inmobiliaria...");

  const insertedAgents: SeedAgent[] = [];
  const agentsPerRealEstate = 3;

  for (let index = 0; index < insertedRealEstates.length; index++) {
    const realEstate = insertedRealEstates[index];
    const coordinator = coordinatorProfiles[index];

    // ── Coordinador ──────────────────────────────────────────────────────
    if (coordinator) {
      const profileReady = await waitForProfile(supabase, coordinator.id);
      if (!profileReady) {
        throw new Error(
          `Timeout esperando el profile del coordinador ${coordinator.id}. ` +
            `Verifica que el trigger handle_new_user esté activo.`,
        );
      }

      const { data: insertedCoord, error: coordError } = await supabase
        .from("real_estate_agents")
        .insert({
          real_estate_id: realEstate.id,
          profile_id: coordinator.id,
          role: EAgentRole.Coordinator,
        })
        .select()
        .single();

      if (coordError) {
        logger.error(
          `Error insertando coordinador (profile_id:${coordinator.id})`,
          coordError.message,
        );
        throw coordError;
      }

      if (insertedCoord) {
        insertedAgents.push({
          id: insertedCoord.id, // ✅ ID real de real_estate_agents
          profile_id: coordinator.id,
          real_estate_id: realEstate.id,
          role: EAgentRole.Coordinator,
        });
      }
    }

    // ── Agentes ──────────────────────────────────────────────────────────
    for (let i = 0; i < agentsPerRealEstate; i++) {
      const agentIndex = index * agentsPerRealEstate + i;
      const agentProfile = agentProfiles[agentIndex];

      if (!agentProfile || agentProfile.id === coordinator?.id) continue;

      const profileReady = await waitForProfile(supabase, agentProfile.id);
      if (!profileReady) {
        throw new Error(
          `Timeout esperando el profile del agente ${agentProfile.id}. ` +
            `Verifica que el trigger handle_new_user esté activo.`,
        );
      }

      const { data: insertedAgent, error: agentError } = await supabase
        .from("real_estate_agents")
        .insert({
          real_estate_id: realEstate.id,
          profile_id: agentProfile.id,
          role: EAgentRole.Agent,
        })
        .select()
        .single();

      if (agentError) {
        logger.error(
          `Error insertando agente (profile_id:${agentProfile.id})`,
          agentError.message,
        );
        throw agentError;
      }

      if (insertedAgent) {
        insertedAgents.push({
          id: insertedAgent.id, // ✅ ID real de real_estate_agents
          profile_id: agentProfile.id,
          real_estate_id: realEstate.id,
          role: EAgentRole.Agent,
        });
      }
    }
  }

  logger.success(
    `✓ ${insertedAgents.length} relaciones agente-inmobiliaria insertadas`,
  );

  try {
    await execSql(
      supabase,
      `CREATE TRIGGER on_real_estate_created
         AFTER INSERT ON real_estates
         FOR EACH ROW
         EXECUTE FUNCTION handle_new_real_estate()`,
    );
    logger.info("Trigger on_real_estate_created recreado");
  } catch (e) {
    logger.warn("No se pudo recrear el trigger");
  }

  return {
    realEstates: insertedRealEstates,
    profiles: [...coordinatorProfiles, ...agentProfiles],
    agents: insertedAgents, // agent.id siempre = real_estate_agents.id
  };
}
