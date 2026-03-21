// ==========================================
// Auth & Profile Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedProfile, SeedUser } from "../types";
import { SeedLogger } from "../lib/logger";

export interface ProfileSeedResult {
  coordinatorProfiles: SeedProfile[];
  agentProfiles: SeedProfile[];
  clientProfiles: SeedProfile[];
}

/**
 * Genera perfiles de prueba (coordinadores, agentes y clientes).
 */
export function generateTestProfiles(options: {
  realEstateCount: number;
  agentsPerRealEstate: number;
  clientsCount: number;
}): ProfileSeedResult {
  const { realEstateCount, agentsPerRealEstate, clientsCount } = options;
  const coordinatorProfiles: SeedProfile[] = [];
  const agentProfiles: SeedProfile[] = [];
  const clientProfiles: SeedProfile[] = [];

  // Nombres de prueba
  const coordinatorNames = [
    "María del Rosario García",
    "Juan Carlos Martínez",
    "Ana Lucía Fernández",
  ];

  const agentNames = [
    "Pedro Miguel López",
    "Carmen Rosa Sánchez",
    "Diego Andrés Rodríguez",
    "Laura Beatriz Moreno",
    "Carlos Alberto Juárez",
    "Sofía Carolina Ruiz",
    "Martín José Torres",
    "Valentina Rocío Díaz",
    "Andrés Felipe Vega",
    "Isabella María Castro",
    "Lucas Manuel Ortiz",
    "Mía Guadalupe Vargas",
  ];

  const clientNames = [
    "Roberto Carlos Mendoza",
    "Patricia Elena Herrera",
    "Federico David Luna",
    "Claudia Beatriz Aguirre",
    "Gustavo Adolfo Ramos",
    "Daniela Patricia Fuentes",
    "Eduardo José Mendoza",
    "Verónica Soledad Cardozo",
  ];

  // Generar coordinadores (1 por inmobiliaria)
  for (let i = 0; i < realEstateCount; i++) {
    const name = coordinatorNames[i] || `Coordinador ${i + 1}`;
    coordinatorProfiles.push({
      id: `pr-coord-${String(i + 1).padStart(4, "0")}`,
      email: `coordinador${i + 1}@zonaraiz.test`,
      fullName: name,
      phone: `+54911${String(4000 + i).padStart(4, "0")}${String(1000 + i).padStart(4, "0")}`,
      role: "real-estate",
      avatarUrl: `https://picsum.photos/seed/coord${i + 1}/200/200`,
    });
  }

  // Generar agentes (3 por inmobiliaria)
  for (let i = 0; i < realEstateCount * agentsPerRealEstate; i++) {
    const name = agentNames[i] || `Agente ${i + 1}`;
    agentProfiles.push({
      id: `pr-agent-${String(i + 1).padStart(4, "0")}`,
      email: `agente${i + 1}@zonaraiz.test`,
      fullName: name,
      phone: `+54911${String(5000 + i).padStart(4, "0")}${String(1000 + i).padStart(4, "0")}`,
      role: "real-estate",
      avatarUrl: `https://picsum.photos/seed/agent${i + 1}/200/200`,
    });
  }

  // Generar clientes
  for (let i = 0; i < clientsCount; i++) {
    const name = clientNames[i] || `Cliente ${i + 1}`;
    clientProfiles.push({
      id: `pr-client-${String(i + 1).padStart(4, "0")}`,
      email: `cliente${i + 1}@zonaraiz.test`,
      fullName: name,
      phone: `+54911${String(6000 + i).padStart(4, "0")}${String(1000 + i).padStart(4, "0")}`,
      role: "client",
      avatarUrl: `https://picsum.photos/seed/client${i + 1}/200/200`,
    });
  }

  return { coordinatorProfiles, agentProfiles, clientProfiles };
}

/**
 * Genera usuarios de auth para Supabase.
 */
export function generateTestUsers(profiles: SeedProfile[]): SeedUser[] {
  return profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    password: "Test123456!", // Contraseña de prueba
    fullName: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    avatarUrl: profile.avatarUrl,
  }));
}

/**
 * Inserta perfiles en la base de datos.
 */
export async function seedProfiles(
  supabase: SupabaseClient,
  profiles: SeedProfile[],
  truncate: boolean
): Promise<void> {
  const logger = new SeedLogger();

  logger.subSection("Seed Profiles");

  if (truncate) {
    logger.info("Truncando perfiles...");
    await supabase.from("profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  logger.info(`Insertando ${profiles.length} perfiles...`);

  const profileInserts = profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    avatar_url: profile.avatarUrl || null,
  }));

  const { error } = await supabase
    .from("profiles")
    .upsert(profileInserts, { onConflict: "id" });

  if (error) {
    logger.error("Error insertando perfiles:", error.message);
    throw error;
  }

  logger.success(`✓ ${profiles.length} perfiles insertados`);
}

/**
 * Crea usuarios en auth.users de Supabase.
 * Nota: Requiere admin rights.
 */
export async function seedAuthUsers(
  supabase: SupabaseClient,
  users: SeedUser[]
): Promise<{ success: number; failed: number }> {
  const logger = new SeedLogger();

  logger.subSection("Seed Auth Users (Opcional)");

  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      // Intentar crear usuario en auth.users
      const { error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          phone: user.phone,
          role: user.role,
        },
      });

      if (error) {
        // Si el usuario ya existe, no es un error crítico
        if (error.message.includes("already been registered")) {
          logger.debug(`Usuario ${user.email} ya existe, omitiendo...`);
          success++;
        } else {
          logger.warn(`Error creando usuario ${user.email}: ${error.message}`);
          failed++;
        }
      } else {
        success++;
      }
    } catch (err) {
      logger.warn(`Excepción creando usuario ${user.email}:`, err);
      failed++;
    }
  }

  logger.info(`Auth users: ${success} creados, ${failed} fallidos o existentes`);

  return { success, failed };
}
